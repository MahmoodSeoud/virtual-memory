import { useEffect, useState } from 'react';
import { Bit, Word } from './App';
import './Box.css'

interface BoxProps {
    box: Word;
    color: string;
    selected: boolean;
    handleClickOnBox(box: Word): boolean;
}
interface BitBoxProps {
    bits: Bit[];
}


function BitBox({ bits }: BitBoxProps) {

    return (
        <div className='bit-box'>
            {
                bits.map((bit, index) => {
                    const color = bit.value === 1 ? bit.color : 'transparent';
                    return (

                        <div key={index} className={'bit'} style={{ backgroundColor: color }}>{bit.address}</div>

                    )

                }
                )}
        </div>
    );
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
    selected && clicked ? classNameBox = 'box highlighted-box' : null;

    let style = {}
    selected ? style = { backgroundColor: color } : null

    return (
        <div className='box-container'>
            {showBits && <BitBox bits={box.bits} key={1} />}
            <div
                className={classNameBox}
                style={style}
                onClick={handleHighlight}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className='box-content'>
                    {/* Display only the first address of the bit on the word */}
                    {box.bits[0].address}
                </div>
            </div>
        </div>
    );
}


export default Box

