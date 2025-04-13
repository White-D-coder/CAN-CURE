import React from "react";

export default function Contact() {
    const doctors = [
        {
            name: "Dr. John Doe",
            specialization: "Oncologist",
            expertise: "Lung Cancer, Breast Cancer",
            experience: 15,
            phone: "+1 123-456-7890",
            email: "johndoe@cancure.com",
            videoCallLink: "https://example.com/video-call/johndoe",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL
        },
        {
            name: "Dr. Krishan Das",
            specialization: "Radiation Oncologist",
            expertise: "Prostate Cancer, Skin Cancer",
            experience: 10,
            phone: "+1 987-654-3210",
            email: "krishandas@cancure.com",
            videoCallLink: "https://example.com/video-call/krishandas",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL
        },
        {
            name: "Dr. Emily Johnson",
            specialization: "Surgical Oncologist",
            expertise: "Colorectal Cancer, Liver Cancer",
            experience: 12,
            phone: "+1 555-123-4567",
            email: "emilyjohnson@cancure.com",
            videoCallLink: "https://example.com/video-call/emilyjohnson",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with actual image URL
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-teal-50 flex justify-center items-center py-10 px-6">
            <div className="max-w-4xl w-full">
                <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
                    Contact Us
                </h1>
                <p className="text-lg text-gray-700 mb-8 text-center">
                    Reach out to our expert doctors for cancer treatment. You can contact them via phone, email, or schedule a video call.
                </p>

                <div className="space-y-8">
                    {doctors.map((doctor, index) => (
                        <div
                            key={index}
                            className="p-6 border border-gray-200 rounded-xl shadow-lg bg-white flex items-start space-x-6 hover:shadow-2xl transition-shadow"
                        >
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-28 h-28 rounded-full object-cover border-2 border-teal-500"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {doctor.name}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    <strong>Specialization:</strong> {doctor.specialization}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <strong>Expertise:</strong> {doctor.expertise}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <strong>Experience:</strong> {doctor.experience} years
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <strong>Phone:</strong>{" "}
                                    <a
                                        href={`tel:${doctor.phone}`}
                                        className="text-teal-600 hover:underline"
                                    >
                                        {doctor.phone}
                                    </a>
                                </p>
                                <p className="text-gray-600 mt-1">
                                    <strong>Email:</strong>{" "}
                                    <a
                                        href={`mailto:${doctor.email}`}
                                        className="text-teal-600 hover:underline"
                                    >
                                        {doctor.email}
                                    </a>
                                </p>
                                <a
                                    href={doctor.videoCallLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 bg-teal-600 text-white px-5 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    Schedule Video Call
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}