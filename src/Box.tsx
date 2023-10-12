import { useEffect, useState } from 'react';
import { Word } from './App';
import './Box.css'

interface BoxProps {
    box: Word;
    color: string;
    selected: boolean;
    handleClickOnBox(box: Word): boolean;
}



function Box({ box, color, selected, handleClickOnBox }: BoxProps) {
    // deconstruct the props
    const [clicked, setClicked] = useState(false);
    const [showBits, setShowBits] = useState<boolean>(false);
    function handleMouseEnter() {
        setShowBits(true)
    }

    function handleMouseLeave() {
        setShowBits(false);
    }

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



    let classNameBox = 'box';
    selected ? classNameBox = 'box selected-box' : null;
    selected && clicked ? classNameBox = 'box highlighted-box' : null;

    let style = {}
    selected ? style = { backgroundColor: color } : null

    return (
        <>
            <div className='box-container'>

                {showBits && <div style={{ backgroundColor: 'red' }}>Hello World</div>}
                <div
                    className={classNameBox}
                    onClick={handleHighlight}
                    style={style}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        className='box-content'
                    >
                        {/* Display only the first address of the bit on the word */}
                        {box.bits[0].address}
                    </div>
                </div>
            </div>
        </>
    )
}


export default Box

