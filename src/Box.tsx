import { useEffect, useState } from 'react';
import { IWord } from './App';
import './Box.css'

interface BoxProps {
    box: IWord;
    color: string;
    selected: boolean;
    handleClickOnBox(box: IWord): boolean;
}



function Box({box, color, selected, handleClickOnBox}: BoxProps) {
    // deconstruct the props
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



    let classNameBox = 'box';
    selected ? classNameBox = 'box selected-box' : null;
    selected && clicked ? classNameBox = 'box highlighted-box' : null;

    let style = {}
    selected ? style = { backgroundColor: color } : null

    return (
        <>
            <div
                className={classNameBox}
                onClick={handleHighlight}
                style={style}
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

