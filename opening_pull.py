import requests
import random
import pickle
import os

class opening_pull():
    def __init__(self, color, move_sequence):
        self.color = color
        self.move_sequence = move_sequence
        self.cache_file = 'opening_cache.pkl'
        if os.path.exists(self.cache_file):
            with open(self.cache_file, 'rb') as f:
                self.cache = pickle.load(f)
        else:
            self.cache = {}
    
    def save_cache(self):
        with open(self.cache_file, 'wb') as f:
            pickle.dump(self.cache, f)

    def query(self, move_sequence):
        move_sequence_tuple = tuple(move_sequence)
        
        if move_sequence_tuple in self.cache:
            #print("Tabulation")
            cached_moves = self.cache[move_sequence_tuple]
            chosen_move = random.choice(cached_moves)
            #print(f"Chosen cached move: {chosen_move}")
            return chosen_move
        
        api_url = f"https://explorer.lichess.ovh/masters?play={','.join(move_sequence)}"
        #print(api_url)
        response = requests.get(api_url)
        
        if response.status_code == 200:
            data = response.json()
            for key in data:
                if key == 'moves':
                    #print(key, ":")
                    print("There did not exist tabulation")
                    top_moves = [move['uci'] for move in data[key][0:min(len(data[key]), 3)]]
                    total_moves = [move['white'] + move['draws'] + move['black'] for move in data[key][0:min(len(data[key]), 3)]] 
                    if sum(total_moves) < 100:
                        print("Out of opening theory, just play")
                        return ""
                    #print("Top moves:", top_moves)
                    else:
                        self.cache[move_sequence_tuple] = top_moves
                        self.save_cache()
                        chosen_move = random.choice(top_moves)
                        #print(f"Chosen move: {chosen_move}")
                        
                        return chosen_move
        else:
            print(f"Error querying Lichess: {response.status_code}")
            return ""

# Test
test = opening_pull(color=1, move_sequence=['g1f3'])
test.query(['g1f3', 'g8f6', 'g2g3', 'g7g6', 'c2c4'])
test.query(['g1f3', 'g8f6', 'g2g3', 'g7g6', "c2c4"])
