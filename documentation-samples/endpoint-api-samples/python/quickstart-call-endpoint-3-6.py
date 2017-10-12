########### Python 3.6 #############
import requests

headers = {
    # Request headers
    'Ocp-Apim-Subscription-Key': 'YOUR-SUBSCRIPTION-KEY',
}

params ={
    # Query parameter
    'q': 'turn on the left light',
    # Optional request parameters, set to default values
    'timezoneOffset': '0',
    'verbose': 'false',
    'spellCheck': 'false',
    'staging': 'false',
}

try:
    r = requests.get('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/60340f5f-99c1-4043-8ab9-c810ff16252d',headers=headers, params=params)
    print(r.json())

except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################
