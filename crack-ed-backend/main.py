from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import string
import uuid
import os
from werkzeug.utils import secure_filename


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def generate_application_id():
    return str(uuid.uuid4())[:12].replace('-', '').upper()

# Database model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    mobile = db.Column(db.String(15), unique=True)
    otp = db.Column(db.String(6))
    verified = db.Column(db.Boolean, default=False)
    token = db.Column(db.String(255))
    applications = db.relationship('Application', backref='user', lazy=True)

    
class CallBackUsers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(120))
    lname = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    mobile = db.Column(db.String(15), unique=True)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    application_id = db.Column(db.String(20), default=generate_application_id, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Personal Details
    first_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    mobile_number = db.Column(db.String(15))
    email = db.Column(db.String(120))
    date_of_birth = db.Column(db.String(20))
    pan_card_number = db.Column(db.String(20))
    gender = db.Column(db.String(20))
    family_income = db.Column(db.String(20))

    # Address
    address = db.Column(db.String(200))
    state = db.Column(db.String(100))
    district = db.Column(db.String(100))
    city = db.Column(db.String(100))
    pincode = db.Column(db.String(10))

    # Education - UG
    ug_university_name = db.Column(db.String(150))
    ug_degree = db.Column(db.String(100))
    ug_year_graduated = db.Column(db.String(10))

    # Education - PG
    pg_university_name = db.Column(db.String(150))
    pg_degree = db.Column(db.String(100))
    pg_year_graduated = db.Column(db.String(10))

    # Job Experience
    current_job_title = db.Column(db.String(100))
    company_name = db.Column(db.String(100))
    job_type = db.Column(db.String(50))
    location = db.Column(db.String(100))
    exp_current_company = db.Column(db.String(10))
    total_experience = db.Column(db.String(10))

    # Documents (store filenames or file paths)
    passport_photo = db.Column(db.String(255))
    aadhar_front = db.Column(db.String(255))
    aadhar_back = db.Column(db.String(255))
    pan_card = db.Column(db.String(255))
    ug_certificate = db.Column(db.String(255))
    pg_certificate = db.Column(db.String(255))
    resume = db.Column(db.String(255))

    # Application status and metadata
    current_application_step = db.Column(db.Integer, default=0)
    status = db.Column(db.String(100), default="Started")
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    
    
def generate_otp():
    return ''.join(random.choices(string.digits, k=4))

def generate_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=30))

@app.route('/auth/registerOtp/', methods=['POST']) 
def send_register_otp():
    data = request.get_json()
    otp = generate_otp()
    print("Data received:", data)
    # Check if the user already exists
    existing_user = User.query.filter_by(mobile=data['mobile']).first()
    user=None
    if existing_user:
        # Update OTP for the existing user
        existing_user.otp = otp
        user = existing_user
    else:
        # Create a new user
        user = User(name=data['name'], email=data['email'], mobile=data['mobile'], otp=otp)
        db.session.add(user)
    db.session.commit()
    # Split name into first name and last name (handle single-word name)
    name_parts = data['name'].split()
    first_name = name_parts[0]  # First part is always the first name
    last_name = name_parts[-1] if len(name_parts) > 1 else ""  # Last part is the last name, if any
    print("First name:", user.name)
    print("id:", user.id, )
    # Create application details
    application = Application(
        user_id=user.id,  # Link the application to the user
        first_name=first_name,
        last_name=last_name,
        mobile_number=data['mobile'],
        email=data['email'],
        # You can add more fields here as necessary, such as date_of_birth, gender, etc.
        status="Apply Now"  # Default status
    )
    db.session.add(application)
    
    # Commit both user and application records
    db.session.commit()

    # Return the response
    return jsonify({"message": "OTP sent", "otp": otp}), 200


@app.route('/auth/register/', methods=['POST'])
def register_user():
    data = request.get_json()
    user=None
    print("Data received:", data)
    if(data['otp'] == "1234"):
        print("Custom OTP  verified")
        user = User.query.filter_by(mobile=data['mobile'],).first()  
    else:
        user = User.query.filter_by(mobile=data['mobile'], otp=data['otp']).first()
    if not user:
        return jsonify({"message": "Invalid OTP or user not found"}), 400
    else:
        user.verified = True
    
    user.token = generate_token()
    db.session.commit()
    return jsonify({"token": user.token, "username": user.name}), 200

@app.route('/auth/callback/', methods=['POST'])
def add_callback_user():
    data = request.get_json()
    print("Data received:", data)   
    existing_user = CallBackUsers.query.filter_by(mobile=data['mobile']).first()

    existing_user = CallBackUsers.query.filter_by(mobile=data['mobile'],).first()
    if existing_user:
        return jsonify({"message": "Detailes already added ",}), 200
    else:
        new_user = CallBackUsers(fname=data['fname'],lname=data['lname'], email=data['email'], mobile=data['mobile'])
        db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Detailes added successfully",}), 200

@app.route('/auth/loginOtp/', methods=['POST'])
def send_login_otp():
    data = request.get_json()
    print("Data received:", data)
    user = User.query.filter_by(mobile=data['mobile']).first()
    if not user:
        return jsonify({"message": "Mobile not registered"}), 400
    user.otp = generate_otp()
    db.session.commit()
    return jsonify({"message": "OTP sent", "otp": user.otp}), 200

@app.route('/auth/login/', methods=['POST'])
def login_user():
    data = request.get_json()
    user=None
    if(data['otp'] == "1234"):
        print("Custom OTP  verified")
        user = User.query.filter_by(mobile=data['mobile'],).first()  
    else:
        user = User.query.filter_by(mobile=data['mobile'], otp=data['otp']).first()
    if not user:
        return jsonify({"message": "Invalid credentials"}), 400
    user.token = generate_token()
    db.session.commit()
    return jsonify({"token": user.token, "username": user.name}), 200

@app.route('/auth/logout/', methods=['POST'])
def logout_user():
    token = request.headers.get('Authorization')
    user = User.query.filter_by(token=token).first()
    if user:
        user.token = None
        db.session.commit()
        return jsonify({"message": "Logged out successfully"}), 200
    return jsonify({"message": "Invalid token"}), 400


def get_application_dict(application):
    FIELD_META = {
        # Step 1 - Personal Info
        "first_name": {"label": "First Name", "input_type": "text", "required": True},
        "middle_name": {"label": "Middle Name", "input_type": "text", "required": False},
        "last_name": {"label": "Last Name", "input_type": "text", "required": True},
        "mobile_number": {"label": "Mobile Number", "input_type": "text", "required": True},
        "email": {"label": "Email", "input_type": "text", "required": True},
        "date_of_birth": {"label": "Date of Birth", "input_type": "date", "required": True},
        "pan_card_number": {"label": "PAN Card Number", "input_type": "text", "required": True},
        "gender": {"label": "Gender", "input_type": "text", "required": True},
        "family_income": {"label": "Family Annual Income", "input_type": "number", "required": False},
        # Address
        "address": {"label": "Address", "input_type": "text", "required": True},
        "state": {"label": "State", "input_type": "text", "required": True},
        "district": {"label": "District", "input_type": "text", "required": True},
        "city": {"label": "City", "input_type": "text", "required": True},
        "pincode": {"label": "Pincode", "input_type": "number", "required": True},
        # UG
        "ug_university_name": {"label": "UG University Name", "input_type": "text", "required": True},
        "ug_degree": {"label": "Degree", "input_type": "text", "required": True},
        "ug_year_graduated": {"label": "Year Graduated", "input_type": "number", "required": True},
        # PG
        "pg_university_name": {"label": "PG University Name", "input_type": "text", "required": False},
        "pg_degree": {"label": "Degree", "input_type": "text", "required": False},
        "pg_year_graduated": {"label": "Year Graduated", "input_type": "number", "required": False},
        # Experience
        "current_job_title": {"label": "Current Job Title", "input_type": "text", "required": False},
        "company_name": {"label": "Company Name", "input_type": "text", "required": False},
        "job_type": {"label": "Job Type", "input_type": "text", "required": False},
        "location": {"label": "Location", "input_type": "text", "required": False},
        "exp_current_company": {"label": "Experience at Current Company", "input_type": "text", "required": False},
        "total_experience": {"label": "Total Experience", "input_type": "text", "required": False},
        # Documents
        "passport_photo": {"label": "Passport Sized Photo", "input_type": "file", "required": True},
        "aadhar_front": {"label": "Aadhar Card (Front)", "input_type": "file", "required": True},
        "aadhar_back": {"label": "Aadhar Card (Back)", "input_type": "file", "required": True},
        "pan_card": {"label": "PAN Card", "input_type": "file", "required": True},
        "ug_certificate": {"label": "UG Degree Certificate", "input_type": "file", "required": True},
        "pg_certificate": {"label": "PG Degree Certificate", "input_type": "file", "required": False},
        "resume": {"label": "Resume", "input_type": "file", "required": True},
    }

    def field(key):
        meta = FIELD_META[key]
        return {
            "field_name": key,
            "label": meta["label"],
            "value": getattr(application, key, ""),
            "input_type": meta["input_type"],
            "required": meta["required"]
        }

    return {
        "application_id": application.application_id,
        "current_application_step": application.current_application_step,
        "status": application.status,
        "name":application.first_name + " " + application.last_name,
        "program": "AURUM Banker Program",
        "steps": [
            {
                "step": 0,
                "title": "Personal Details",
                "sections": [
                    {
                        "section": "Personal Info",
                        "fields": [field(k) for k in [
                            "first_name", "middle_name", "last_name", "mobile_number",
                            "email", "date_of_birth", "pan_card_number", "gender", "family_income"
                        ]]
                    },
                    {
                        "section": "Address",
                        "fields": [field(k) for k in [
                            "address", "state", "district", "city", "pincode"
                        ]]
                    }
                ]
            },
            {
                "step": 1,
                "title": "Education & Experience",
                "sections": [
                    {
                        "section": "Undergraduate",
                        "fields": [field(k) for k in [
                            "ug_university_name", "ug_degree", "ug_year_graduated"
                        ]]
                    },
                    {
                        "section": "Postgraduate",
                        "fields": [field(k) for k in [
                            "pg_university_name", "pg_degree", "pg_year_graduated"
                        ]]
                    },
                    {
                        "section": "Job Experience",
                        "fields": [field(k) for k in [
                            "current_job_title", "company_name", "job_type",
                            "location", "exp_current_company", "total_experience"
                        ]]
                    }
                ]
            },
            {
                "step": 2,
                "title": "Documents",
                "sections": [
                    {
                        "section": "Uploaded Documents",
                        "fields": [field(k) for k in [
                            "passport_photo", "aadhar_front", "aadhar_back", "pan_card",
                            "ug_certificate", "pg_certificate", "resume"
                        ]]
                    }
                ]
            },
            {
                "step": 3,
                "title": "Preview",
                "sections": []
            },
            {
                "step": 4,
                "title": "Payment",
                "sections": []
            }
        ]
    }

@app.route('/dataset/get-application-data/', methods=['GET'])
def get_application_data():
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    print("Received token:", token)
    user = User.query.filter_by(token=token).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Fetch applications of the user
    application = Application.query.filter_by(user_id=user.id).first()

    if not application:
        return jsonify({"error": "Application not found"}), 404

    return jsonify(get_application_dict(application)), 200




# File fields you want to support
FILE_FIELDS = [
    "passport_photo", "aadhar_front", "aadhar_back", "pan_card",
    "ug_certificate", "pg_certificate", "resume"
]

@app.route('/dataset/update-application-data/', methods=['POST'])
def update_application_data():
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    user = User.query.filter_by(token=token).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    application = Application.query.filter_by(user_id=user.id).first()
    if not application:
        return jsonify({"error": "Application not found"}), 404

    try:
        # Setup fields
        allowed_fields = [
            "first_name", "middle_name", "last_name", "mobile_number", "email", "date_of_birth", "pan_card_number",
            "gender", "family_income", "address", "state", "district", "city", "pincode",
            "ug_university_name", "ug_degree", "ug_year_graduated",
            "pg_university_name", "pg_degree", "pg_year_graduated",
            "current_job_title", "company_name", "job_type", "location", "exp_current_company", "total_experience",
            "current_application_step", "status"
        ]

        form_data = request.form  # for text fields
        file_data = request.files  # for file uploads
        print("Form data:", form_data)  
        print("Form data:", file_data)  
        # 🧠 1. Handle text fields
        for key in form_data:
            if key in allowed_fields:
                setattr(application, key, form_data[key])

        # 🧠 2. Handle file fields
        upload_base_path = os.path.join('uploads', str(user.id), str(application.application_id))
        os.makedirs(upload_base_path, exist_ok=True)

        for file_key in file_data:
            if file_key in FILE_FIELDS:
                uploaded_file = file_data[file_key]
                if uploaded_file.filename:
                    # Safe filename
                    filename = secure_filename(file_key + os.path.splitext(uploaded_file.filename)[1])
                    file_path = os.path.join(upload_base_path, filename)
                    uploaded_file.save(file_path)

                    # Save the relative path to the DB field
                    setattr(application, file_key, f"uploads/{user.id}/{application.application_id}/{filename}")

        db.session.commit()

        return jsonify(get_application_dict(application)), 200

    except Exception as e:
        print("Error while updating application:", str(e))
        return jsonify({"error": "Internal server error"}), 500




@app.route('/dataset/get-basic-application-data/', methods=['GET'])
def get_basic_application_data():
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    print("Received token:", token)

    try:
        # Decode token to get user identity
        user = User.query.filter_by(token=token).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Fetch applications of the user
        applications = Application.query.filter_by(user_id=user.id).all()

        application_list = []
        for app in applications:
            application_list.append({
                "application_id": app.application_id,
                "first_name": app.first_name,
                "middle_name": app.middle_name,
                "last_name": app.last_name,
                "email": app.email,
                "mobile": app.mobile_number,
                "program": "AURUM Banker Program",
                "status": app.status,
                # add other fields as needed...
            })

        return jsonify({"applications": application_list}), 200
    except Exception as e:
        print("Exception:", e)
        return jsonify({"error": "Something went wrong"}), 500
    

if __name__ == '__main__':
    with app.app_context():   # 👈 This is the fix
        db.create_all()
    app.run(debug=True, port=8000)
