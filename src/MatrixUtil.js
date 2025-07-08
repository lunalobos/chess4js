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
import { getLogger, getLoggerFromBean } from "./loggers.js";
import { bitboardFromSquares } from "./bitboards.js";
import { getSquare } from "./squares.js";
import { Bitboard } from "./Bitboard.js";
export class MatrixUtil extends Bean{
    static logger = getLogger("MatrixUtil");

    constructor(name) {
        super(name);

        /**
         * 
         * @type {number[][]}
         */
        this.blackPawnMatrix1 = [ [], [], [], [], [], [], [], [], [ 0 ], [ 1 ],
            [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ], [ 8 ], [ 9 ], [ 10 ], [ 11 ], [ 12 ], [ 13 ], [ 14 ], [ 15 ],
            [ 16 ], [ 17 ], [ 18 ], [ 19 ], [ 20 ], [ 21 ], [ 22 ], [ 23 ], [ 24 ], [ 25 ], [ 26 ], [ 27 ], [ 28 ],
            [ 29 ], [ 30 ], [ 31 ], [ 32 ], [ 33 ], [ 34 ], [ 35 ], [ 36 ], [ 37 ], [ 38 ], [ 39 ], [ 40, 32 ],
            [ 41, 33 ], [ 42, 34 ], [ 43, 35 ], [ 44, 36 ], [ 45, 37 ], [ 46, 38 ], [ 47, 39 ], [ 48 ], [ 49 ], [ 50 ],
            [ 51 ], [ 52 ], [ 53 ], [ 54 ], [ 55 ] ];
        /**
         * 
         * @type {number[][]}
         */
        this.blackPawnMatrix2 = [ [], [], [], [], [], [], [], [], [ 1 ], [ 0, 2 ],
            [ 1, 3 ], [ 2, 4 ], [ 3, 5 ], [ 4, 6 ], [ 5, 7 ], [ 6 ], [ 9 ], [ 8, 10 ], [ 9, 11 ], [ 10, 12 ],
            [ 11, 13 ], [ 12, 14 ], [ 13, 15 ], [ 14 ], [ 17 ], [ 16, 18 ], [ 17, 19 ], [ 18, 20 ], [ 19, 21 ],
            [ 20, 22 ], [ 21, 23 ], [ 22 ], [ 25 ], [ 24, 26 ], [ 25, 27 ], [ 26, 28 ], [ 27, 29 ], [ 28, 30 ],
            [ 29, 31 ], [ 30 ], [ 33 ], [ 32, 34 ], [ 33, 35 ], [ 34, 36 ], [ 35, 37 ], [ 36, 38 ], [ 37, 39 ], [ 38 ],
            [ 41 ], [ 40, 42 ], [ 41, 43 ], [ 42, 44 ], [ 43, 45 ], [ 44, 46 ], [ 45, 47 ], [ 46 ], [ 49 ], [ 48, 50 ],
            [ 49, 51 ], [ 50, 52 ], [ 51, 53 ], [ 52, 54 ], [ 53, 55 ], [ 54 ] ];
        /**
         * 
         * @type {Bitboard[]}
         */    
        this.blackPawnCaptureMoves = this.blackPawnMatrix2.map(e => {
            const squares = e.map(e => getSquare(e));
            return bitboardFromSquares(...squares);
        });



        MatrixUtil.logger.instantiation();
    }


}