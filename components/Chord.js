const Chord = ({ name, notes }) => {
    return (
        <div className="flex items-center justify-center w-full h-20 text-center bg-gray-100 md:w-20">
            <div>
                {name}

                <div className="mt-2 space-x-1 text-xs">
                    {notes.map((i, index) => (
                        <span key={index}>{i}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chord;
