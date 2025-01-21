import React from 'react';
import ResponsiveLogo from '../logo/ResponsiveLogo';
import Button from '../ui/buttons/Button';


const Navbar: React.FC = () => {

    return (
        <div className='h-17 max-w-7xl w-full py-4 px-6 flex items-center justify-between '>

            <ResponsiveLogo />

            <div className='flex items-center gap-4'>
                <Button title={"Login"} />
                <Button title={"SignUp"} />
            </div>
        </div>
    )
}
export default Navbar;