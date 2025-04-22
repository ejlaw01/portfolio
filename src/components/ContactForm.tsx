const ContactForm = () => {
    return (
        <form className="w-full max-w-sm font-sans mt-6" method="POST" action="https://formspree.io/f/mblgeknb">
            <div className="mb-4">
                <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    required
                />
            </div>
            <div className="mb-4">
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                />
            </div>
            <div className="mb-4">
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="message"
                    name="message"
                    placeholder="Message"
                    required
                ></textarea>
            </div>
            <div className="flex items-center justify-between">
                <input
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    value="Submit"
                />
            </div>
        </form>
    );
};

export default ContactForm;
