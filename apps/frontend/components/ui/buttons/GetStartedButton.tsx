import React from 'react';

type GetStartedButtonProps = {
    onClick?: () => void;
};

const GetStartedButton: React.FC<GetStartedButtonProps> = ({ onClick }) => {

    return (
        <button className='px-4 py-2 text-white rounded-md border border-indigo-300 bg-indigo-300  bg-opacity-15 font-medium hover:bg-opacity-20 '>
            Get Started For Free
        </button>
    )
}
export default GetStartedButton;