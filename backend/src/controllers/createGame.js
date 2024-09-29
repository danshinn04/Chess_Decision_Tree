


class createGame {



    static async create(req, res) {
        console.log("works")
        return res.status(200).send("backend works")
    }
}

export default createGame