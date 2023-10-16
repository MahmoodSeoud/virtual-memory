import { useEffect, useState } from 'react'
import './App.css'
import './vm.css'
import Words from './Words'

export type BitGroup = {
  color?: string;
  bitCount: number;
}

export type Word = {
  bits: Bit[];
  address: string;
  color?: string;
}


export type Bit = {
  address: string;
  value: number;
  color?: string;
}

const ALLOCATION_CONSTANTS = {
  BIT_IN_WORD_64BIT: 64,
  BIT_IN_WORD_32BIT: 32,
  BYTES_IN_32BIT_WORD: 4,
  WORD_SIZE_64BIT: 8,
  BITS_IN_BYTE: 8,
} as const;


function getRandomColor(): string {
  return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1) 25%`;
}


function App() {
  const [allocatedWords, setAllocatedWords] = useState<Word[]>([]);
  const [amountToAllocate, setAmountToAllocate] = useState<number>(0);
  const [words, setWords] = useState<Word[]>([]);
  const [highlightedWords, setHighlightedWords] = useState<Word[]>([]);
  const [showError, setShowError] = useState<boolean>(false);
  const [groupedBits, setGroupedBits] = useState<BitGroup[]>([]);


  useEffect(() => {
    setShowError(false);
  }, [amountToAllocate])


  useEffect(() => {
    console.log('----------------')
    console.log("words", words)
    console.log('allocatedWords', allocatedWords)
    console.log("Groupedwords", groupedBits)
  }, [words, allocatedWords, groupedBits])


  useEffect(() => {
    const words = createAdddress(12222, 8, ALLOCATION_CONSTANTS.BIT_IN_WORD_32BIT);
    setWords(words);

  }, [])



  function createAdddress(address: number, amountOfAdresses: number, wordSizeBits: number, baseNumber: number = 16): Word[] {
    /* 
    address : The address in which the virtual memory should start from
    amountOfAdresses : number of address words that should be present
    wordSizeBits : the size of the word in the current system in bits
    baseNumber : The base number (default is 16 for hexadecimal)
    */
    const amountOfWordsBits = amountOfAdresses * wordSizeBits;
    const wordAdresses: Word[] = [];

    let basePrefix = "";
    switch (baseNumber) {
      case 2:
        basePrefix = "0b";
        break;
      case 10:
        // do nothing as we don't use prefix
        break
      case 16:
        basePrefix = "0x";
        break;
      default:
        break;
    }

    const bitGroups: BitGroup[] = [];

    for (let i = 0; i < amountOfWordsBits; i += wordSizeBits) {
      const wordAddress: number = address + i
      const wordAddressStr: string = basePrefix + (address + i).toString(baseNumber);

      const bits: Bit[] = [];
      const bitGroup: BitGroup = {
        bitCount: words.flatMap(word => word.bits.filter(bit => bit.value === 1)).length
      }

      for (let j = 0; j < wordSizeBits; j++) {
        const bitAddress = basePrefix + (wordAddress + j).toString(baseNumber);

        bits.push({
          address: bitAddress,
          value: 0,
        });
      }

      bitGroups.push(bitGroup);

      wordAdresses.push({
        bits: bits,
        address: wordAddressStr,
        color: ''
      });

    }
    return wordAdresses;
  }



  function handleClickOnBox(word: Word): boolean {

    if (!allocatedWords.includes(word)) {
      // if the box is not selected we cannot highlight it
      return false;
    }

    if (highlightedWords.includes(word)) {
      // if the box is already selected, deselect it
      setHighlightedWords(highlightedWords.filter(selectedBox => selectedBox !== word))
    } else {
      // if the box is not selected, select it
      setHighlightedWords([...highlightedWords, word])
    }
    return true;
  }


  // handle the malloc click
  function handleAllocateClick() {
    const bitGroupColor = getRandomColor();

    const availableBits = [...words].flatMap((word) => {
      return word.bits.filter(bit => bit.value === 0)
    });

    const fstAvailableBitIndex = availableBits.indexOf(availableBits[0]);
    availableBits
      .slice(fstAvailableBitIndex,
        fstAvailableBitIndex + amountToAllocate * ALLOCATION_CONSTANTS.BITS_IN_BYTE
      )
      .forEach(bit => {
        bit.value = 1;
        bit.color = bitGroupColor
      });

    const bitColors = [...words]
      .map(word => word.bits
        .filter(bit => bit.value === 1)
        .map(bit => bit.color));
    const uniqueColors = bitColors.flatMap((color) => [...new Set(color)])

    const RGB_FILLERS = ['rgba(0,0,0,0) 25%', 'rgba(0,0,0,0) 25%', 'rgba(0,0,0,0) 25%', 'rgba(0,0,0,0) 25%'];

    // Set the color of the word to the color of the bit
    [...words].forEach((word) => {
      const isAllocated = word.bits.some((bit) => bit.value === 1);


      if (isAllocated) {
        uniqueColors // `linear-gradient(to right, red 50%, green 50%)

        uniqueColors.map((color, index) => { RGB_FILLERS[index] = color});

        const uniqueColorStr = `linear-gradient(to right, ${RGB_FILLERS.map((color) => ` ${color}`)})`;
        word.color = uniqueColorStr;
      }
    })

    // If some bit are set to 1, add the word to the allocated words
    const tempAllocatedWords: Word[] = [];
    words.forEach((word) => {

      if (word.bits.some((bit) => bit.value === 1)) {
        tempAllocatedWords.push(word)
      }
    });


    setAllocatedWords([...allocatedWords, ...tempAllocatedWords]);

    // Group the words
    const groups: BitGroup = {
      color: bitGroupColor,
      bitCount: words.flatMap(word => word.bits).length
    };

    setGroupedBits([...groupedBits, groups]);


  }




  // handle the free click
  function handleFreeClick() {
    const remaining = allocatedWords.filter(word => !highlightedWords.includes(word));
    setAllocatedWords(remaining);
    setHighlightedWords([]);
  }



  return (
    <>
      {/* Error msg incase of too many words */}
      {showError &&
        <div className='error-container'>
          <p className='error-msg'>
            Not enough space for {amountToAllocate} words
          </p>
        </div>}
      <div className='main-frame'>

        <div>
          <h1 className='title'>Virtual Memory</h1>
          <h2>32 bit words</h2>
        </div>


        <div className='virtual-memory-container'>
          <div className="allocation-container">
            {groupedBits && groupedBits.length > 0 && groupedBits.map((group, index) => (
              <div key={index}>
                <p className="allocation-text" style={{ color: group.color }}>
                  P{index} = {group.bitCount / 32} bytes ({group.bitCount} bits)
                </p>
              </div>
            ))}
          </div>

          <div className='block-container'>
            {words && words.length > 0 && words.map((word, index) => {
              const allocated = allocatedWords.includes(word);

              return (
                <>
                  <Words
                    key={index}
                    word={word}
                    color={word.color}
                    handleClickOnBox={handleClickOnBox}
                    allocated={allocated}
                  />
                </>
              );
            })}
          </div>
        </div>
      </div>

      <div className='alloc-buttons'>
        <div>
          <button
            className='alloc-button'
            onClick={handleFreeClick}
          >
            Free
          </button>
          <button
            className='alloc-button'
            onClick={() => handleAllocateClick()}
          >
            Malloc
          </button>
          <input
            onChange={(ev) => setAmountToAllocate(Number(ev.target.value))}
            className='input-bits'
            autoFocus
            placeholder='32'

          />
        </div>
        <p style={{ fontSize: 22 }}>Bytes</p>
      </div>



      <div className='authors'>
        Mahmood & Phil - SysMentor
      </div>
    </>
  )
}

export default App

