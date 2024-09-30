import {useEffect} from "react";
import $ from 'jquery';


const MainMenu = () => {





    const createGame = async () => {
        try {
            const response = await fetch('http://localhost:3399/create-game', {
                method: 'POST'
            })

            if (response.ok) {
                const data = await response.json();
                console.log(data.Link.link)

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