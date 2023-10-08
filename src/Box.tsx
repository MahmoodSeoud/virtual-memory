import { useEffect, useState } from 'react';
import { IAddressBox } from './App';
import './Box.css'

interface BoxProps {
    box: IAddressBox;
    selected: boolean;
    handleClickOnBox(box: IAddressBox): boolean;
}



function Box(props: BoxProps) {
    // deconstruct the props
    const { box, selected, handleClickOnBox } = props;
    const [clicked, setClicked] = useState(false);

    function handleHighlight() {
        const isHighlighted = handleClickOnBox(box);
        setClicked(isHighlighted);
    }

    // Reset the clicked state when the selected state changes
    useEffect(() => {
        if (selected) {
            setClicked(false);
        }
    }, [selected])

    let classNameBox = 'box'
    selected ? classNameBox = 'box selected-box' : null
    selected && clicked ? classNameBox = 'box highlighted-box' : null

    return (
        <>
            <div
                className={classNameBox}
                onClick={handleHighlight}
            >
                <div
                    className='box-content'
                >
                    {box.address}

                </div>
            </div>
        </>
    )
}


export default Box

