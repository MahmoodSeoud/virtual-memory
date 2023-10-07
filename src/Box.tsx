import { IAddressBox } from './App';
import './Box.css'

interface BoxProps {
    box: IAddressBox;
    onClick: (address: string) => void;
    selected: boolean;
    clicked: boolean;
}

function Box(props: BoxProps) {

    return (
        <>
            <div
                className={`box ${props.selected ? 'selected-box' : 'selected-box red'}`}
                onClick={() => props.onClick(props.box.address)}
            >
                <div
                    className='box-content'
                >
                    {props.box.address}

                </div>
            </div>
        </>
    )
}


export default Box

