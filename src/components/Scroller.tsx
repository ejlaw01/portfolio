import { FiChevronDown } from "react-icons/fi";

function Scroller({ target }) {
    const iconSize = 70;
    const iconClasses = `-mt-12`;

    return (
        <a className='flex flex-col items-center' href={target}>
            <span className='font-bold text-pink-400'>Scroll</span>
            <div className='flex flex-col mt-12'>
                <FiChevronDown
                    size={iconSize}
                    className={`text-pink-200 ${iconClasses}`}
                />
                <FiChevronDown
                    size={iconSize}
                    className={`text-pink-300 ${iconClasses}`}
                />
                <FiChevronDown
                    size={iconSize}
                    className={`text-pink-450 ${iconClasses}`}
                />
            </div>
        </a>
    );
}

export default Scroller;
