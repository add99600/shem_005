import requests

key = 'vfGXBJayvqykTYsR5MWYyaSAWYu6tpUKaPQ0X7bdmtvedFho3hM9vGalrl9Q9izZZy/AwAt54sA+qUJ/63415g=='

url = 'http://apis.data.go.kr/B552015/NpsBplcInfoInqireService/getBassInfoSearch'
params = {
    'serviceKey' : key, 
    'wkpl_nm' : '하나마이크론',
}

response = requests.get(url, params=params)

if response.status_code == 200:
    response_data = response.content.decode('utf-8')
    print(response_data)
else:
    print(f"Error: {response.status_code}")