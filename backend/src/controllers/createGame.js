
import { nanoid } from 'nanoid';


class createGame {



    static async create(req, res) {

        try {
            console.log("work s")
            const link = nanoid(8);
            return res.status(201).send({
                Link: {link},
                message: 'success'
            })
        }
        catch{

        }

    }
}

export default createGame