import { useState } from 'react';
import { IAddressBox } from './App';
import './Box.css'

interface BoxProps {
    box: IAddressBox;
    selected: boolean;
    handleClickOnBox(box: IAddressBox): void
}



function Box(props: BoxProps) {
    // deconstruct the props
    const { box, selected, handleClickOnBox } = props

    const [clicked, setClicked] = useState(false)

    function handleHighlight() {
        setClicked(!clicked)
    }

    let classNameBox = 'box'
    selected ? classNameBox = 'box selected-box' : null
    selected && clicked ? classNameBox = 'box highlighted-box' : null

    return (
        <>
            <div
                className={classNameBox}
                onClick={() => {
                    handleClickOnBox(box)
                    handleHighlight()
                }}
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

