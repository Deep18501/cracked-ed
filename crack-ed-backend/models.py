import uuid
import random
from extensions import db, migrate
from database import Base

def generate_application_id():
    prefix = "AUBO"
    while True:
        unique_digits = f"{random.randint(0, 99999999):08d}"
        application_id = prefix + unique_digits
        if not Application.query.filter_by(application_id=application_id).first():
            return application_id


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120))
    mobile = db.Column(db.String(15), unique=True)
    otp = db.Column(db.String(6))
    otp_txn_id = db.Column(db.String(100))
    verified = db.Column(db.Boolean, default=False)
    token = db.Column(db.String(255))
    applications = db.relationship('Application', backref='user', lazy=True)

    
class CallBackUsers(db.Model):
    __tablename__ = "callback_users"
    id = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(120))
    lname = db.Column(db.String(120))
    city = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    mobile = db.Column(db.String(15), unique=True)
    otp = db.Column(db.String(6))
    otp_txn_id = db.Column(db.String(100))
    verified = db.Column(db.Boolean, default=False)

    
class Application(db.Model):
    __tablename__ = "application"

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

    # Razorpay payment fields
    razorpay_order_id = db.Column(db.String(100))
    razorpay_payment_id = db.Column(db.String(100))
    razorpay_payment_status = db.Column(db.String(50))
    razorpay_payment_amount = db.Column(db.Float)
    razorpay_payment_method = db.Column(db.String(50))
    razorpay_payment_timestamp = db.Column(db.DateTime)
    
    # Individual payment tracking fields
    registration_fee_paid = db.Column(db.Boolean, default=False)
    registration_fee_amount = db.Column(db.Float, default=500.0)
    registration_fee_payment_id = db.Column(db.String(100))
    registration_fee_payment_timestamp = db.Column(db.DateTime)
    
    first_installment_paid = db.Column(db.Boolean, default=False)
    first_installment_amount = db.Column(db.Float, default=1000.0)
    first_installment_payment_id = db.Column(db.String(100))
    first_installment_payment_timestamp = db.Column(db.DateTime)
    
    second_installment_paid = db.Column(db.Boolean, default=False)
    second_installment_amount = db.Column(db.Float, default=1500.0)
    second_installment_payment_id = db.Column(db.String(100))
    second_installment_payment_timestamp = db.Column(db.DateTime)