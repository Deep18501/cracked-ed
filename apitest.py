import time
import hashlib
import requests

# Replace with your actual credentials
customer_key = "362405"
api_key = "RHFLK7kkQN4fGtNwnXOhvpXreO2hJxx1"

# Current time in milliseconds
timestamp = str(int(time.time() * 1000))

# Create the string to hash
string_to_hash = customer_key + timestamp + api_key

# SHA-512 hash (in lowercase hex)
hash_value = hashlib.sha512(string_to_hash.encode('utf-8')).hexdigest().lower()

# URL to which the request is sent (replace with the actual miniOrange OTP API endpoint)
SEND_URL = "https://login.xecurify.com/moas/api/auth/challenge" 
VALIDATE_URL = "https://login.xecurify.com/moas/api/auth/validate" 

# Example request body for sending OTP (check actual miniOrange docs for the correct structure)
payload = {
    "customerKey": customer_key,
    "phone": "919992932919",  # Replace with the mobile number
    "authType": "SMS", 
}

payload2 = {
   "txId": "fdbeb2e6-2a87-11f0-9aec-02757087abe5",
	"token": "280354"
}

# Set headers
headers = {
    "Customer-Key": customer_key,
    "Timestamp": timestamp,
    "Authorization": hash_value,
    "Content-Type": "application/json"
}

# Send the request
response = requests.post(url2, json=payload2, headers=headers)

# Print the response
print(f"Status Code: {response.status_code}")
print(f"Response: {response.json()}")


