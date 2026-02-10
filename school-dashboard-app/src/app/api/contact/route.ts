import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        // Validate input
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Configure Transporter
        // Note: In a real app, use environment variables for credentials.
        // For this demo, we assume environment variables are set or basic SMTP structure.
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your SMTP provider
            auth: {
                user: process.env.EMAIL_USER, // e.g. frontend876@gmail.com
                pass: process.env.EMAIL_PASS, // App Password
            },
        });

        // Email Content
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: 'frontend876@gmail.com', // Receiver address (User specified)
            replyTo: email, // Allow replying to the sender
            subject: `New Contact Form Submission: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2563EB;">New Message from Joyfull School Website</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 1px solid #eee;" />
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        };

        // Send Email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Email send error:', error);
        return NextResponse.json(
            { message: 'Failed to send message', error: error.message },
            { status: 500 }
        );
    }
}
