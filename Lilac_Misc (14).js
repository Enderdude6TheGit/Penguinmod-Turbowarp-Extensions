/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "lilacmisc",
                "name": "Lilac Misc",
                "color1": "#d3a0d9",
                "color2": "#c282d3",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "1",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[11] is null",
        arguments: {
            "11": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["1"] = async (args, util) => {
        if (Boolean((args["11"] == ''))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: "2",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "if [21] is true",
        arguments: {
            "21": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'true',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["2"] = async (args, util) => {
        if (Boolean((args["21"] == 'true'))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: "3",
        blockType: Scratch.BlockType.COMMAND,
        text: "alert [31]",
        arguments: {
            "31": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["3"] = async (args, util) => {
        alert(args["31"])
    };

    blocks.push({
        opcode: "4",
        blockType: Scratch.BlockType.REPORTER,
        text: "[41]",
        arguments: {
            "41": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["4"] = async (args, util) => {
        return args["41"]
    };

    blocks.push({
        opcode: "5",
        blockType: Scratch.BlockType.REPORTER,
        text: "if [51] then [52] else [53]",
        arguments: {
            "51": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "52": {
                type: Scratch.ArgumentType.STRING,
            },
            "53": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["5"] = async (args, util) => {
        return (args["51"] ? args["52"] : args["53"])
    };

    Scratch.extensions.register(new Extension());
})(Scratch);