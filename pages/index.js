import Head from 'next/head';
import { useEffect, useState } from 'react';
import Select from '../components/Select';
import Toggle from '../components/Toggle';
import Heading from '../components/Heading';
import Chord from '../components/Chord';
import Note from '../components/Note';
import NoteSet from '../components/NoteSet';

const NOTES = 'A,A#/Bb,B,C,C#/Db,D,D#/Eb,E,F,F#/Gb,G,G#/Ab';

const CHORDS_MAJOR = ['', 'm', 'm', '', '', 'm', 'dm'];
const CHORDS_MINOR = ['m', 'dm', '', 'm', 'm', '', ''];
const PROGRESSIONS = [
    [1, 5, 6, 4],
    [1, 4, 5],
    [2, 5, 1],
    [1, 6, 4, 5],
    [1, 5, 6, 3, 4, 1, 4, 5],
];

function romanize(num) {
    if (isNaN(num)) return NaN;
    var digits = String(+num).split(''),
        key = [
            '',
            'C',
            'CC',
            'CCC',
            'CD',
            'D',
            'DC',
            'DCC',
            'DCCC',
            'CM',
            '',
            'X',
            'XX',
            'XXX',
            'XL',
            'L',
            'LX',
            'LXX',
            'LXXX',
            'XC',
            '',
            'I',
            'II',
            'III',
            'IV',
            'V',
            'VI',
            'VII',
            'VIII',
            'IX',
        ],
        roman = '',
        i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
}

export default function Home() {
    const [showFlats, setShowFlats] = useState(false);
    const [scale, setScale] = useState('major');
    const [scales, setScales] = useState([]);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(0);

    function getScaleNotes(root) {
        const rootIndex = notes.findIndex((item) => item === root);
        const start = notes.slice(0, rootIndex);
        const end = notes.slice(rootIndex);
        const full_scale = [...end, ...start];

        const major = [
            full_scale[0],
            full_scale[2],
            full_scale[4],
            full_scale[5],
            full_scale[7],
            full_scale[9],
            full_scale[11],
        ];

        const minor = [
            full_scale[0],
            full_scale[2],
            full_scale[3],
            full_scale[5],
            full_scale[7],
            full_scale[8],
            full_scale[10],
        ];

        // C, D, E, F, G, A, B
        // C, D, E♭, F, G, A♭, B♭
        // C, Dm, Em, F, G, Am, Bdim

        return {
            major,
            minor,
        };
    }

    function getScaleChords(major_scale, minor_scale) {
        const scale_two_octaves = [...major_scale, ...major_scale];
        const scale_two_octaves_min = [...minor_scale, ...minor_scale];

        const major = [...Array(7).keys()].map((item) => {
            const note_scale = [...scale_two_octaves].splice(item);

            return {
                name: `${note_scale[0]}${CHORDS_MAJOR[item]}`,
                notes: [note_scale[0], note_scale[2], note_scale[4]],
            };
        });

        const minor = [...Array(7).keys()].map((item) => {
            const note_scale = [...scale_two_octaves_min].splice(item);

            return {
                name: `${note_scale[0]}${CHORDS_MINOR[item]}`,
                notes: [note_scale[0], note_scale[2], note_scale[4]],
            };
        });

        return { major, minor };
    }

    function getChordProgressions({ major, minor }) {
        const major_prog = PROGRESSIONS.map((set) => {
            return { format: set, set: set.map((step) => major[step - 1]) };
        });

        const minor_prog = PROGRESSIONS.map((set) => {
            return { format: set, set: set.map((step) => minor[step - 1]) };
        });

        return { major: major_prog, minor: minor_prog };
    }

    useEffect(() => {
        const n = NOTES.split(',').map((item) => {
            if (!item.includes('/')) return item;
            const sharp_flats = item.split('/');
            if (showFlats) return sharp_flats[1];
            return sharp_flats[0];
        });
        setNotes(n);
    }, [showFlats]);

    useEffect(() => {
        const scale = notes.map((root, index) => {
            const { major, minor } = getScaleNotes(root);
            const chords = getScaleChords(major, minor);
            return {
                id: index,
                name: root,
                notes: { major, minor },
                chords,
                progressions: getChordProgressions(chords),
            };
        });
        setScales(scale);
    }, [notes]);

    // console.log(scales);

    if (scales.length <= 0) return null;

    const currentNote = scales.find((i) => i.id === selectedNote);
    //
    // console.log(currentNote);

    return (
        <div className="p-5 md:p-10">
            <div className="grid grid-cols-1 gap-4 mb-8 md:flex md:space-x-5">
                <div className="min-w-[200px]">
                    <Select
                        items={scales}
                        onChange={(item) => setSelectedNote(scales.findIndex((s) => s.id === item.id))}
                        selected={selectedNote}
                        label="Note"
                    />
                </div>
                <div className="min-w-[200px]">
                    <Select
                        items={[
                            { id: 'major', name: 'Major' },
                            { id: 'minor', name: 'Minor' },
                        ]}
                        onChange={(item) => setScale(item.id)}
                        selected={scale}
                        label="Scale"
                    />
                </div>
                <Toggle enabled={showFlats} onChange={(value) => setShowFlats(value)} label="Toggle Flats" />
            </div>

            <div className="space-y-10">
                {/* <Heading>All Notes</Heading>
                <NoteSet>
                    {notes.map((note, index) => (
                        <Note key={index} note={note} />
                    ))}
                </NoteSet> */}
                <div>
                    <Heading>
                        {currentNote.name} <span className="capitalize">{scale}</span> Scale
                    </Heading>

                    <NoteSet>
                        {currentNote.notes[scale].map((note, index) => (
                            <Note key={index} note={note} />
                        ))}
                    </NoteSet>
                </div>

                <div>
                    <Heading>
                        {currentNote.name} <span className="capitalize">{scale}</span> Chords
                    </Heading>

                    <NoteSet>
                        {currentNote.chords[scale].map((chord, index) => (
                            <Chord {...chord} key={index} />
                        ))}
                    </NoteSet>
                </div>

                <div>
                    <Heading>
                        {currentNote.name} <span className="capitalize">{scale}</span> Progressions
                    </Heading>

                    <div className="space-y-5">
                        {currentNote.progressions[scale].map((progression, index) => (
                            <>
                                <h3>
                                    Progression #{index + 1} ({progression.format.map((i) => romanize(i)).join('-')})
                                </h3>
                                <NoteSet key={index}>
                                    {progression.set.map((chord, index) => (
                                        <Chord {...chord} key={index} />
                                    ))}
                                </NoteSet>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
