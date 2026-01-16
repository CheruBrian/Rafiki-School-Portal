import React from "react";

function SchoolContact() {
    return (
        <div>
            <h2>Contact Us</h2>
            <p>For any inquiries, please contact us through the form below:</p>
            <form>
                <label>
                    Name:
                    <input type="name" placeholder=" " minLength={3} maxLength={13}></input>
                    Email:
                    <input type="email" placeholder=" " minLength={4} maxLength={40}></input>
                    Phone number:
                    <input type="tel" placeholder=" " minLength={9} maxLength={20}></input>
                    <button type="Submit"></button>
                </label>
            </form>
        </div>
    )
}

export default SchoolContact;