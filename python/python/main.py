from flask import Flask, render_template, request, redirect, url_for, send_file, session, jsonify, flash
import os
from werkzeug.utils import secure_filename
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from datetime import datetime, timedelta
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import razorpay
from dotenv import load_dotenv
from functools import wraps
import logging
from logging.handlers import RotatingFileHandler
from pytz import utc
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
import threading
import shutil
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads/'
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'default-secret-key-for-dev')
app.config['SESSION_TYPE'] = 'filesystem'

# Configure logging
log_handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
log_handler.setLevel(logging.INFO)
app.logger.addHandler(log_handler)
app.logger.setLevel(logging.INFO)

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Razorpay Configuration
RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET')
client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Google Services Setup
SCOPES = ['https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.file']

CREDS = ServiceAccountCredentials.from_json_keyfile_name('fin-kyc-454710-53c6e6c9b68a.json', SCOPES)

# Initialize Google Sheet
try:
    client_gsheet = gspread.authorize(CREDS)
    spreadsheet = client_gsheet.open('FIN-KYC')
    sheet = spreadsheet.sheet1
    
    existing_headers = sheet.row_values(1)
    
    required_headers = [
    "Registration Number", "Name", "DOB", "Phone Number", "Email", 
    "Registration Amount", "Profile", "Courses", "Job Location", 
    "Aadhar", "PAN", "Address", "City", "State", "Pin Code", 
    "Aadhar Front", "Aadhar Back", "PAN Photo", "Registration Date",
    "Payment ID", "Payment Status", "Payment Amount", "Payment Method", "Payment Timestamp",
    "Drive Folder ID",
    "Loan Amount", "Loan Status", "Loan Disbursed Date", "Loan Provider Company"  # New loan fields
    ]
    
    if not existing_headers or set(existing_headers) != set(required_headers):
        if existing_headers:
            sheet.clear()
        sheet.append_row(required_headers)
        
except Exception as e:
    print(f"Error initializing Google Sheet: {e}")

# Initialize Google Drive Service
drive_service = build('drive', 'v3', credentials=CREDS)

# Background scheduler for cleanup
scheduler = BackgroundScheduler()
scheduler.start()



@app.route('/register', methods=['POST'])
def register():
    try:
        # Extract form data
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        registration_amount = request.form['registration_amount']
        course = request.form['course']
        profile = request.form['profile']
        address = request.form['address']
        city = request.form['city']
        state = request.form['state']
        pin_code = request.form['pincode']
        dob = request.form['dob']
        job_location = request.form['job-location']
        aadhar = request.form['aadhar']
        pan = request.form['pan']

        # Handle file uploads
        aadhar_front = request.files['aadhar_photo_1']
        aadhar_back = request.files['aadhar_photo_2']
        pan_photo = request.files['pan_photo']

        # Secure filenames
        aadhar_front_filename = secure_filename(f"{phone}_aadhar_front.jpg")
        aadhar_back_filename = secure_filename(f"{phone}_aadhar_back.jpg")
        pan_photo_filename = secure_filename(f"{phone}_pan.jpg")

        # Save files to upload folder
        aadhar_front.save(os.path.join(app.config['UPLOAD_FOLDER'], aadhar_front_filename))
        aadhar_back.save(os.path.join(app.config['UPLOAD_FOLDER'], aadhar_back_filename))
        pan_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], pan_photo_filename))

        # Generate a unique registration number
        current_row_count = len(sheet.get_all_values())  # includes header row
        next_row = current_row_count + 1 if current_row_count > 0 else 2

        registration_number = f"Crack-ED-{name[:3].upper()}{phone[-4:]}-{next_row - 1}"

        # Save data to Google Sheets immediately (before payment)
        registration_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # In your register route, update the sheet.append_row() call to include empty loan fields:
        sheet.append_row([
            registration_number, name, dob, phone, email,
            registration_amount, profile, course, job_location,
            aadhar, pan, address, city, state, pin_code,
            aadhar_front_filename, aadhar_back_filename, pan_photo_filename, registration_date,
            "", "pending", "", "", "", "",
            "", "", "", ""  # Empty loan fields
        ])

        # Store minimal data in session
        session['registration_number'] = registration_number
        session['name'] = name
        session['email'] = email

        # Create Razorpay order
        amount_in_paise = int(float(registration_amount) * 100)  # Razorpay uses paise
        
        order_data = {
            'amount': amount_in_paise,
            'currency': 'INR',
            'receipt': registration_number,
            'payment_capture': 1,
            'notes': {
                'registration_number': registration_number,
                'name': name,
                'email': email
            }
        }
        
        order = client.order.create(data=order_data)
        
        # Start document backup in background thread
        user_data = {
            'Registration Number': registration_number,
            'Name': name,
            'Phone Number': phone,
            'Aadhar Front': aadhar_front_filename,
            'Aadhar Back': aadhar_back_filename,
            'PAN Photo': pan_photo_filename
        }
        
        # Start backup in background thread
        backup_thread = threading.Thread(
            target=backup_user_documents,
            args=(registration_number, user_data)
        )
        backup_thread.start()
        
        return redirect(url_for('payment_page', 
                            order_id=order['id'],
                            amount=registration_amount,
                            name=name,
                            email=email,
                            phone=phone,
                            registration_number=registration_number))
    except Exception as e:
        return f"Error during registration: {str(e)}", 500


@app.route('/payment')
def payment_page():
    return render_template('payment.html',
                         order_id=request.args.get('order_id'),
                         razorpay_key=RAZORPAY_KEY_ID,
                         amount=request.args.get('amount'),
                         name=request.args.get('name'),
                         email=request.args.get('email'),
                         phone=request.args.get('phone'),
                         registration_number=request.args.get('registration_number'))

@app.route('/payment-success', methods=['POST'])
def payment_success():
    # Verify payment signature
    razorpay_payment_id = request.form.get('razorpay_payment_id')
    razorpay_order_id = request.form.get('razorpay_order_id')
    razorpay_signature = request.form.get('razorpay_signature')
    
    params_dict = {
        'razorpay_order_id': razorpay_order_id,
        'razorpay_payment_id': razorpay_payment_id,
        'razorpay_signature': razorpay_signature
    }
    
    try:
        client.utility.verify_payment_signature(params_dict)
        
        # Get order details to ensure we have the registration number
        order = client.order.fetch(razorpay_order_id)
        registration_number = order.get('notes', {}).get('registration_number')
        
        if not registration_number:
            registration_number = session.get('registration_number')
            if not registration_number:
                return redirect(url_for('index'))
        
        # Store payment details in session temporarily
        session['payment_id'] = razorpay_payment_id
        session['order_id'] = razorpay_order_id
        
        # Redirect to processing page
        return redirect(url_for('payment_processing', reg_num=registration_number))
        
    except razorpay.errors.SignatureVerificationError:
        flash('Payment verification failed', 'danger')
        return redirect(url_for('index'))

@app.route('/check_payment_status')
def check_payment_status():
    registration_number = request.args.get('registration_number')
    
    if not registration_number:
        return jsonify({'error': 'Registration number missing'}), 400
    
    try:
        # First check if we have payment data in session (for immediate feedback)
        if session.get('payment_id'):
            return jsonify({
                'status': 'completed',
                'registration_number': registration_number
            })
        
        # Then check Google Sheets
        records = sheet.get_all_records()
        user_record = next(
            (row for row in records 
             if row.get('Registration Number') == registration_number), 
            None
        )
        
        if not user_record:
            return jsonify({'error': 'Registration not found'}), 404
            
        if user_record.get('Payment Status', '').lower() == 'captured':
            return jsonify({
                'status': 'completed',
                'registration_number': registration_number
            })
        else:
            return jsonify({'status': 'pending'})
            
    except Exception as e:
        app.logger.error(f"Error checking payment status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/payment_processing')
def payment_processing():
    registration_number = request.args.get('reg_num')
    if not registration_number:
        return redirect(url_for('index'))
    return render_template('processing.html', registration_number=registration_number)

@app.route('/webhook', methods=['POST'])
def webhook():
    # Verify webhook signature
    webhook_secret = os.getenv('WEBHOOK_SECRET')
    if not webhook_secret:
        return jsonify({'status': 'error', 'message': 'Webhook secret not configured'}), 500
        
    received_signature = request.headers.get('X-Razorpay-Signature')
    
    try:
        client.utility.verify_webhook_signature(
            request.get_data().decode('utf-8'),
            received_signature,
            webhook_secret
        )
    except razorpay.errors.SignatureVerificationError:
        app.logger.error("Webhook signature verification failed")
        return jsonify({'status': 'error', 'message': 'Invalid signature'}), 400
    except Exception as e:
        app.logger.error(f"Webhook verification error: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Verification error'}), 400
    
    payload = request.get_json()
    event = payload.get('event', '')
    
    if event == 'payment.captured':
        try:
            payment_data = payload['payload']['payment']['entity']
            order_id = payment_data['order_id']
            
            # Get order details
            order = client.order.fetch(order_id)
            registration_number = order.get('notes', {}).get('registration_number')
            
            if not registration_number:
                app.logger.error("No registration number in order notes")
                return jsonify({'status': 'error', 'message': 'Missing registration number'}), 400
            
            # Update Google Sheets
            try:
                # Find the row with this registration number
                records = sheet.get_all_records()
                row_index = None
                for i, row in enumerate(records, start=2):  # start=2 because header is row 1
                    if row.get('Registration Number') == registration_number:
                        row_index = i
                        break
                
                if row_index:
                    # Update payment details
                    updates = [
                        (20, payment_data['id']),  # Payment ID
                        (21, 'captured'),          # Payment Status
                        (22, payment_data['amount'] / 100),  # Amount
                        (23, payment_data['method']),  # Method
                        (24, datetime.fromtimestamp(payment_data['created_at']).strftime('%Y-%m-%d %H:%M:%S'))  # Timestamp
                    ]
                    
                    for col, value in updates:
                        sheet.update_cell(row_index, col, value)
                    
                    app.logger.info(f"Updated payment details for {registration_number}")
                else:
                    app.logger.error(f"Registration number {registration_number} not found in sheet")
                
            except Exception as e:
                app.logger.error(f"Google Sheets update error: {str(e)}")
                return jsonify({'status': 'error', 'message': 'Sheet update failed'}), 500
            
        except Exception as e:
            app.logger.error(f"Payment processing error: {str(e)}")
            return jsonify({'status': 'error', 'message': 'Payment processing failed'}), 500
    
    return jsonify({'status': 'success'}), 200

@app.route('/user/<string:registration_number>')
def user_dashboard(registration_number):
    if session.get('registration_number') != registration_number:
        return redirect(url_for('index'))
    
    # Get user data from Google Sheets
    records = sheet.get_all_records()
    user_data = next((row for row in records if row['Registration Number'] == registration_number), None)
    
    if not user_data:
        return "User not found", 404
    
    return render_template('user_dashboard.html', 
                         user_data=user_data,
                         registration_number=registration_number)

@app.route('/download_pdf/<string:registration_number>')
def download_pdf(registration_number):
    if session.get('registration_number') != registration_number:
        return redirect(url_for('index'))
    
    records = sheet.get_all_records()
    user_data = next((row for row in records if row['Registration Number'] == registration_number), None)

    if not user_data:
        return "User not found", 404

    pdf_filename = f"user_{registration_number}_registration.pdf"
    c = canvas.Canvas(pdf_filename, pagesize=letter)

    c.setFont("Helvetica", 12)

    # Add user data to PDF
    c.drawString(230, 750, "Candidate Registration Details")
    c.drawString(50, 730, f"Registration Number: {user_data['Registration Number']}")
    c.drawString(50, 710, f"Name: {user_data['Name']}")
    c.drawString(350, 710, f"Phone: {user_data['Phone Number']}")
    c.drawString(50, 690, f"Email: {user_data['Email']}")
    c.drawString(50, 665, f"Course: {user_data['Courses']}")
    c.drawString(350, 665, f"Profile: {user_data['Profile']}")
    c.drawString(50, 640, f"Address: {user_data['Address']}")
    c.drawString(350, 640, f"City: {user_data['City']}")
    c.drawString(50, 620, f"State: {user_data['State']}")
    c.drawString(350, 620, f"Pin Code: {user_data['Pin Code']}")
    c.drawString(50, 595, f"Aadhar: {user_data['Aadhar']}")
    c.drawString(350, 595, f"PAN: {user_data['PAN']}")

    if 'Payment ID' in user_data:
        c.drawString(50, 570, "Payment Details:")
        c.drawString(50, 550, f"Payment ID: {user_data['Payment ID']}")
        c.drawString(350, 550, f"Status: {user_data['Payment Status']}")
        c.drawString(50, 530, f"Amount: ₹{user_data['Payment Amount']}")
        c.drawString(350, 530, f"Method: {user_data['Payment Method']}")
        c.drawString(50, 510, f"Date: {user_data['Payment Timestamp']}")

    # Add images to PDF
    aadhar_front_path = os.path.join(app.config['UPLOAD_FOLDER'], user_data['Aadhar Front'])
    pan_photo_path = os.path.join(app.config['UPLOAD_FOLDER'], user_data['PAN Photo'])
    aadhar_back_path = os.path.join(app.config['UPLOAD_FOLDER'], user_data['Aadhar Back'])

    c.drawString(50, 420, "Aadhar Front:")
    c.drawImage(ImageReader(aadhar_front_path), 150, 290, width=200, height=140)

    c.drawString(50, 280, "Aadhar Back:")
    c.drawImage(ImageReader(aadhar_back_path), 150, 150, width=200, height=140)
    
    c.drawString(50, 140, "PAN Photo:")
    c.drawImage(ImageReader(pan_photo_path), 150, 10, width=200, height=140)

    c.save()

    return send_file(pdf_filename, as_attachment=True)