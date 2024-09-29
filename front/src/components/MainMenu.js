import {useEffect} from "react";


const MainMenu = () => {


    const createGame = async () => {
        try {
            const response = await fetch('http://localhost:3399/create-game', {
                method: 'POST'
            })

            if (response.ok) {
                console.log("ok test");
            }
        }
        catch {
            console.log('error')

        }

    }


    return <>

        <button onClick={createGame}>Create game</button>
    </>
}

export default MainMenu