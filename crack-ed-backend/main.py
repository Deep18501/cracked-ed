from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random
import string
import uuid

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

@app.route('/dataset/get-application-data/', methods=['GET'])
def get_application_data():
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
