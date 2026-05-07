import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr, BaseModel

from typing import List



from src.Utills.email_config import (
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USERNAME,
    EMAIL_PASSWORD
)


conf = ConnectionConfig(
    MAIL_USERNAME = "choudharyayush290@gmail.com",
    MAIL_PASSWORD = "locl sowj nuje sjxz",
    MAIL_FROM = "choudharyayush290@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_FROM_NAME="Class Managment System.",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)


async def send_email(emails:List[str],
    student_name: str,
    batch_name: str,
    course_name: str,
    faculty_name: str,
    faculty_department: str,
    faculty_designation: str,
    start_date,
    end_date
):
    html = f"""
    <html>
        <body>
            <h2>🎓 Enrollment Confirmation</h2>

            <p>Hi <b>{student_name}</b>,</p>

            <p>You have been successfully enrolled in the following batch:</p>

            <ul>
                <li><b>Batch Name:</b> {batch_name}</li>
                <li><b>Course Name:</b> {course_name}</li>
                <li><b>Faculty Name:</b> {faculty_name}</li>
                <li><b>Department:</b> {faculty_department}</li>
                <li><b>Designation:</b> {faculty_designation}</li>
                <li><b>Start Date:</b> {start_date}</li>
                <li><b>End Date:</b> {end_date}</li>
            </ul>

            <p>We wish you all the best for your learning journey 🚀</p>

            <br>
            <p><b>Regards,</b><br>
            Institute Management Team</p>
        </body>
    </html>
    """


    message = MessageSchema(
        subject="Registation Configuration",
        recipients=emails,
        body=html,
        subtype=MessageType.html)

    fm = FastMail(conf)
    await fm.send_message(message)
    return {"message": "email has been sent"}

















# def send_student_enroll_email(
#     admin_email: str,
#     student_email: str,
#     admin_name: str,
#     student_name: str,
#     batch_name: str,
#     course_name: str,
#     faculty_name: str,
#     faculty_department: str,
#     faculty_designation: str,
#     start_date,
#     end_date
# ):
#     try:
#         msg = MIMEMultipart()
#         msg["From"] = admin_email
#         msg["To"] = student_email
#         msg["Subject"] = "Batch Enrollment Confirmation"

#         body = f"""
# Hello {student_name},

# Congratulations 🎉  
# You have been successfully enrolled in the following batch.

# 📘 Course Name   : {course_name}
# 👥 Batch Name    : {batch_name}

# 📅 Batch Duration:
# Start Date : {start_date}
# End Date   : {end_date}

# 👨‍🏫 Faculty Details:
# Name        : {faculty_name}
# Department  : {faculty_department}
# Designation : {faculty_designation}

# If you have any questions, feel free to contact us.

# Regards,
# {admin_name}
# (Admin)
# """

#         msg.attach(MIMEText(body, "plain"))

#         server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
#         server.starttls()
#         server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
#         server.send_message(msg)
#         server.quit()

#         return True

#     except Exception as e:
#         print("Email error:", e)
#         return False




