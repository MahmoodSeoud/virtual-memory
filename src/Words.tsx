import { Word } from "./App";
import Box from "./Box";
import './Box.css'
import './App.css'
import { useState } from "react";

interface IWordProps {
    box: Word;
    color: string;
    selected: boolean;
    handleClickOnBox(box: Word): boolean;
}



function Words({ selected, handleClickOnBox, color, box }: IWordProps) {

    return (

        <Box
            box={box}
            color={color}
            handleClickOnBox={handleClickOnBox}
            selected={selected}
        />

    );
}
export default Words;