/*
* Copyright 2025 Miguel Angel Luna Lobos
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*     http://www.apache.org/licenses/LICENSE-2.0
* 
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { Square } from "./Square.js";


export const squares = [
    "A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1",
    "A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2",
    "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3",
    "A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4",
    "A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5",
    "A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6",
    "A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7",
    "A8", "B8", "C8", "D8", "E8", "F8", "G8", "H8"
].map(name => new Square(name)).reduce((obj, sq) => {
    obj[sq.name()] = sq
    return obj;
}, {});

export const {
    A1, B1, C1, D1, E1, F1, G1, H1,
    A2, B2, C2, D2, E2, F2, G2, H2,
    A3, B3, C3, D3, E3, F3, G3, H3,
    A4, B4, C4, D4, E4, F4, G4, H4,
    A5, B5, C5, D5, E5, F5, G5, H5,
    A6, B6, C6, D6, E6, F6, G6, H6,
    A7, B7, C7, D7, E7, F7, G7, H7,
    A8, B8, C8, D8, E8, F8, G8, H8
} = squares;

const squaresArray = [
    squares.A1, squares.B1, squares.C1, squares.D1, squares.E1, squares.F1, squares.G1, squares.H1,
    squares.A2, squares.B2, squares.C2, squares.D2, squares.E2, squares.F2, squares.G2, squares.H2,
    squares.A3, squares.B3, squares.C3, squares.D3, squares.E3, squares.F3, squares.G3, squares.H3,
    squares.A4, squares.B4, squares.C4, squares.D4, squares.E4, squares.F4, squares.G4, squares.H4,
    squares.A5, squares.B5, squares.C5, squares.D5, squares.E5, squares.F5, squares.G5, squares.H5,
    squares.A6, squares.B6, squares.C6, squares.D6, squares.E6, squares.F6, squares.G6, squares.H6,
    squares.A7, squares.B7, squares.C7, squares.D7, squares.E7, squares.F7, squares.G7, squares.H7,
    squares.A8, squares.B8, squares.C8, squares.D8, squares.E8, squares.F8, squares.G8, squares.H8
];

/**
 * Returns the Square object at the given index, or undefined if the index is out of range.
 * @param {number} index - The index of the Square to retrieve.
 * @return {Square} The Square at the given index, or undefined if the index is out of range.
 */
export function getSquare(index) {
    return squaresArray[index];
}

/**
 * 
 * @param {string} name 
 */
function indexOf(name){
    const col = name.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    const row = parseInt(name[1]);
    return (row - 1) * 8 + (col);
}


/**
 * Returns the Square object with the specified name.
 * 
 * The name should be in the format of a chess square, e.g., "a1", "h8".
 * 
 * @param {string} name - The name of the Square to retrieve.
 * @return {Square} The Square object with the specified name, or undefined if no such Square exists.
 */

export function getSquareFromName(name){
    return squaresArray[indexOf(name)];
}