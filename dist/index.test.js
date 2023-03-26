"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const _1 = require(".");
(0, mocha_1.describe)('index.ts', () => {
    (0, mocha_1.describe)('compile()', () => {
        (0, mocha_1.it)('Should throw an error if no paths are provided', () => {
            (0, chai_1.expect)(() => (0, _1.compile)([])).to.throw(Error, 'compile() must receive at least one path.');
        });
        (0, mocha_1.it)('Should throw an error if the paths are not all the same length.', () => {
            (0, chai_1.expect)(() => (0, _1.compile)([
                'M0,0 L1,1',
                'M0,0 L1,1 L2,2'
            ])).to.throw('All paths must have the same number of commands.');
        });
        (0, mocha_1.it)('Should throw an error if any path has a different sequence of commands', () => {
            (0, chai_1.expect)(() => (0, _1.compile)([
                'M0,0 L1,1 C1,2,3,4,5,6',
                'M0,0 L1,1 L2,2'
            ])).to.throw('All paths must be variations of the same sequence of commands.');
        });
        (0, mocha_1.it)('Should generate an average path of the same length as the paths provided', () => {
            const paths = [
                'M0,0 L1,1 L3,3',
                'M0,0 L1,1 L2,2'
            ];
            const { average } = (0, _1.compile)(paths);
            (0, chai_1.expect)(average.length).to.equal(3);
        });
        (0, mocha_1.it)('Should generate a command-major array of average parameters', () => {
            const paths = [
                'M0,0 L1,1 L3,3',
                'M0,0 L1,1 L2,2'
            ];
            const { average } = (0, _1.compile)(paths);
            (0, chai_1.expect)(average).to.deep.equal([
                [0, 0],
                [1, 1],
                [2.5, 2.5] // L3,3 and L2,2
            ]);
        });
        (0, mocha_1.it)('Should generate a command-major array of difference parameters', () => {
            const paths = [
                'M0,0 L1,1 L3,3',
                'M0,0 L1,1 L2,2'
            ];
            const { diffs } = (0, _1.compile)(paths);
            (0, chai_1.expect)(diffs).to.deep.equal([
                [[0 - 0, 0 - 0], [0 - 0, 0 - 0]],
                [[1 - 1, 1 - 1], [1 - 1, 1 - 1]],
                [[3 - 2.5, 2 - 2.5], [3 - 2.5, 2 - 2.5]] // L3,3 and L2,2 - avg
            ]);
        });
        (0, mocha_1.it)('Should generate an average path identical to the provided path if only one path is provided', () => {
            const paths = [
                'M0,0 L1,1 L3,3'
            ];
            const { average } = (0, _1.compile)(paths);
            (0, chai_1.expect)(average).to.deep.equal([
                [0, 0],
                [1, 1],
                [3, 3]
            ]);
        });
        (0, mocha_1.it)('Should generate a diff path of zeros if only one path is provided', () => {
            const paths = [
                'M0,0 L1,1 L3,3'
            ];
            const { diffs } = (0, _1.compile)(paths);
            (0, chai_1.expect)(diffs).to.deep.equal([
                [[0], [0]],
                [[0], [0]],
                [[0], [0]]
            ]);
        });
        (0, mocha_1.it)('Should generate an array of commands representing the command sequence in the provided paths', () => {
            const paths = [
                'M0,0 L1,1 L3,3',
                'M0,0 L1,1 L2,2'
            ];
            const { commands } = (0, _1.compile)(paths);
            (0, chai_1.expect)(commands).to.deep.equal(['M', 'L', 'L']);
        });
    });
    (0, mocha_1.describe)('morph()', () => {
        (0, mocha_1.it)('Should throw an error if the number of weights does not equal the number of paths', () => {
            const paths = [
                'M0,0 L1,1 L3,3',
                'M0,0 L1,1 L2,2'
            ];
            const compiled = (0, _1.compile)(paths);
            (0, chai_1.expect)(() => (0, _1.morph)(compiled, [0.5])).to.throw('Weights must have the same length as the number of paths.');
        });
        (0, mocha_1.it)('Should generate a path identical to a path with weight=1 and weight=0 for all other paths', () => {
            const paths = [
                'M0 0 L1 1 L3 3',
                'M0,0 L1,1 L2,2'
            ];
            const compiled = (0, _1.compile)(paths);
            const morphed = (0, _1.morph)(compiled, [1, 0]);
            (0, chai_1.expect)(morphed).to.equal('M0 0 L1 1 L3 3');
        });
    });
});
//# sourceMappingURL=index.test.js.map