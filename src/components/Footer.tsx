import data from "../../public/data.json";
import parse from "html-react-parser";
import { FaRegEnvelope } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

type pageData = {
    headline: string;
    name: string;
    title: string;
    email: string;
    location: string;
};

const Footer = () => {
    const { headline, name, title, email, location }: pageData = data.contact;

    return (
        <>
            <footer className="relative overflow-y-hidden py-12">
                <h3 className="font-normal">{parse(headline)}</h3>
                <div className="pt-10 flex flex-wrap gap-10">
                    <a
                        href="mailto:ethan@bitlore.io"
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-700 font-semibold flex items-center gap-3"
                    >
                        <FaRegEnvelope size="32" />
                        <span>Email</span>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/ethan-law/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-700 font-semibold flex items-center gap-1"
                    >
                        <FaLinkedin size="32" />
                        <span>LinkedIn</span>
                    </a>
                    <a
                        href="https://github.com/ejlaw01"
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-700 font-semibold flex items-center gap-1"
                    >
                        <FaGithub size="32" />
                        <span>GitHub</span>
                    </a>
                    <a
                        href="https://drive.google.com/file/d/1WO4KvKPa6YmQGdnJwCcry0Bf6NkKHyvh/view?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className="text-pink-700 font-semibold flex items-center gap-1"
                    >
                        <IoDocumentTextOutline size="32" />
                        <span>C.V.</span>
                    </a>
                </div>
            </footer>
        </>
    );
};

export default Footer;
