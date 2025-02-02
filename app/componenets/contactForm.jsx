"use client";

import { useState } from 'react';

export const ContactForm = () => {

    return (
        <div className="p-6">
            <h2 className="text-white text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-white mb-6">
                If you have any inquiries get in touch with us,<br/> we'll be happy to help you.
            </p>

            <div className="space-y-4">
                <div>
                    <p className="text-white mb-2">Contact no.</p>
                    <span className="text-white border pr-20">+91 9876543210</span>
                </div>

                <div>
                    <p className="text-white mb-2">Whatsapp no.</p>
                    <span className="text-white">+91 9876543210</span>
                </div>

                <div>
                    <label className="block text-white mb-2">Email</label>
                    <span>example@example.com</span>
                </div>
            </div>
        </div>
    );
};