from datetime import datetime
from config.database import db
from services.notification_service import push

def record_user_details(email: str, name: str = "Name not provided", notes: str = "not provided") -> dict:
    """Record that a user is interested in being in touch and provided an email address.
    
    Args:
        email: The email address of this user.
        name: The user's name, if they provided it.
        notes: Any additional information or message content left by the user.
    """
    print(f"Tool called: record_user_details(email={email}, name={name}, notes={notes})", flush=True)
    
    # Clean inputs
    clean_name = str(name).strip()[:80] if name else "Name not provided"
    if "{" in clean_name or "[" in clean_name:
        clean_name = "Name not provided"
        
    clean_notes = str(notes).strip()[:500] if notes else "User wants to get in touch"
    if "{" in clean_notes or "[" in clean_notes:
        clean_notes = "User wants to get in touch"
        
    # Save to MongoDB contacts collection
    if db is not None:
        try:
            date_submitted = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
            db.contacts.insert_one({
                "name": clean_name,
                "email": email,
                "message": clean_notes,
                "dateSubmitted": date_submitted
            })
            print("Recorded contact details successfully to MongoDB.", flush=True)
        except Exception as ex:
            print(f"Database error writing contact details: {ex}", flush=True)
            
    # Send push notification
    body = f"{clean_name} | {email} | {clean_notes}"
    push(body, title="Someone wants to contact you")
    return {"recorded": "ok"}


def record_unknown_question(question: str) -> dict:
    """Record that a question could not be answered from the retrieved context.
    
    Args:
        question: The user's exact question that could not be answered.
    """
    print(f"Tool called: record_unknown_question(question={question})", flush=True)
    
    # Save to MongoDB unknown_questions collection
    if db is not None:
        try:
            date_submitted = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")
            db.unknown_questions.insert_one({
                "question": question,
                "dateSubmitted": date_submitted
            })
            print("Recorded unknown question successfully to MongoDB.", flush=True)
        except Exception as ex:
            print(f"Database error writing unknown question: {ex}", flush=True)
            
    # Send push notification
    push(f"Recording: {question}", title="Unknown Question")
    return {"recorded": "ok"}
