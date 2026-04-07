import { FaRegEnvelope } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

const Footer = () => {
    return (
        <footer className="relative z-10 py-12">
            <div className="flex flex-wrap gap-10">
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
            <div className="mt-12 pt-8 border-t border-pink-200 text-sm text-pink-600 lg:w-1/2">
                <p>&copy; {new Date().getFullYear()} Bit Lore. Portland, OR.</p>
            </div>
        </footer>
    );
};

export default Footer;
