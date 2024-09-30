
import { nanoid } from 'nanoid';



 class User {

    gameLink;

    generateGameLink() {
        this.gameLink = nanoid(8);
    }

}

export default User