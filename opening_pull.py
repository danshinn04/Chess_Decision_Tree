import requests
import random
class opening_pull():
    def __init__(self, color, move_sequence):
        encoding = []
        #Color = 0: White
        #Color = 1: Black

    
    
    def decoder(move_seq):
        return None

    def query(self, move_sequence):
        api_url = f"https://explorer.lichess.ovh/masters?play={','.join(move_sequence)}"
        print(api_url)
        response = requests.get(api_url)
            
        if response.status_code == 200:
            data = response.json()
            for key in data:  
                
                if key == 'moves':
                    
                    print(key,":",)
                    print(*data[key][0:min(len(data[key]), 3)], sep='\n') 

                    n = random.randint(0, 2)
                    print(data[key][n]['uci'])
                    return data[key][n]['uci']
        
                
                
        else:
            print(f"Error querying Lichess: {response.status_code}")
            return None

#Test
puller = opening_pull(color=1, move_sequence=['g1f3'])
puller.query(['g1f3', 'g8f6', 'g2g3', 'g7g6'])