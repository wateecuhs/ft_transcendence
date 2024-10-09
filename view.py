from django.shortcuts import render
from .models import User
from django.shortcuts import redirect
from .forms import UserForm

# Code 200 -OK
# Code 201 -Created
# Code 400 -Bad Request
# Code 404 -Not Found
# Code 500 -Internal Server Error

# Request GET - Used to retrieve data from the server.
# GET requests are typically used to fetch resources from the server, such as retrieving a user's information or listing all users.
# This method is read-only and should not modify the server's data.
# Data sent with a GET request is appended to the URL as query parameters, making it visible in the address bar.
# GET requests can be cached, bookmarked, and they have a length limit.
# Example usage: Getting a list of tournaments or retrieving specific user details by ID or name.

# Request POST - Used to send data to the server to create a new resource.
# POST requests are typically used to create new data on the server, such as adding a new user, tournament, or match history.
# The data is included in the body of the request and is not visible in the URL.
# POST requests can modify server-side data, so they are not considered idempotent (sending the same request multiple times can result in different outcomes).
# Example usage: Submitting a form to create a new user or a new tournament in the database.

# Request PUT - Used to update or replace an existing resource on the server.
# PUT requests typically replace the entire content of an existing resource with the data sent in the request body.
# It is often used when you need to update a full resource or create it if it does not exist.
# Unlike POST, PUT is idempotent, meaning that calling the same PUT request multiple times will always produce the same result.
# Example usage: Updating a user's information (e.g., name, status) or completely updating a tournament’s details.

# Request PATCH - Used to partially update an existing resource on the server.
# PATCH requests are used when only a subset of a resource's data needs to be updated (e.g., just the name or status of a user).
# It is different from PUT, which generally requires the entire resource data, whereas PATCH only sends the fields that need modification.
# PATCH is also idempotent, meaning multiple identical requests will have the same result.
# Example usage: Partially updating a user's status without changing other fields like name or tournament association.

# Request DELETE - Used to delete an existing resource from the server.
# DELETE requests are used to remove data from the server, such as deleting a user, a tournament, or a match history.
# This method modifies the state of the server by removing the specified resource.
# It is idempotent, meaning that sending the same DELETE request multiple times will result in the same outcome (the resource will either be deleted or remain absent).
# Example usage: Deleting a user from the database or removing a specific tournament based on its ID.


# ----- User ----- #

# Create a user (POST)
def create_user(request)
  if request.method == 'POST':
    try:
      data = json.loads(request.body)
      name = data.get('name')
      status = data.get('status')
      avatar = data.get('avatar')
      tournament_id = data.get('tournament_id')

      user = add_user(name, status, avatar, tournament_id)
      if (user)
        return JsonResponse({"message": "User created succesfully", "user_id": user.id}, status=201)
      return JsonResponse({"error": "Failed to create user"}, status=400)
    except Exception as e:
      return JsonResponse({"error": str(e)}, status=500)

def add_friend(request, user_id, friend_id):
    user = User.get_user_by_id(user_id)
    friend = User.get_user_by_id(friend_id)


    if user and friend:
        if friend not in user.friends.all():
            user.friends.add(friend)
            return JsonResponse({'status': 'success', 'message': f'{friend.name} has been added as a friend.'})
        else:
            return JsonResponse({'status': 'error', 'message': f'{friend.name} is already a friend.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'User or friend not found.'})

# Get a user (GET)
def get_user(request, name):
  if request.method == 'GET':
    user = get_user_by_name(name)
    if user
      response_data = {
        "name": user.name
        "status": user.status
        "tournament_id": user.tournament_id.id if user.tournament_id else None
      }
      return JsonResponse(response_data, status=200)
    else:
      JsonResponse({"error": "User not found"}, status=404)

# Update a user (PUT)
def update_user_info(request, user_id):
  if request.method == 'PUT':
    try:
      data = json.loads(request.body)
      name = data.get('name')
      status = data.get('status')
      avatar = data.get('avatar')
      tournament_id = data.get('tournament_id')

      user = update_user(user_id, name=name, status=status, avatar=avatar, tournament_id=tournament_id)
      if user:
        return JsonResponse({"message": "User updated succesfully"}, status=200)
      else:
        return JsonResponse({"error": "Fialed to update user"}, status=400)
    except Exception as e:
      return JsonResponse({"error": str(e)}, status=500)

# Delete a user (DELETE)
def delete_user_info(request, user_id):
  if request.method == 'DELETE':
    if delete_user(user_id):
      return JsonResponse({"message": "User deleted succesfully", status=200})
    else:
      return JsonResponse({"error": "User not found", status=404})

# ----- Tournament ----- #

# Create a tournament (POST)
def create_tournament(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            duration = data.get('duration')

            tournament = add_tournament(name, start_date=start_date, end_date=end_date, duration=duration)
            if tournament:
                return JsonResponse({"message": "Tournament created successfully", "tournament_id": tournament.id}, status=201)
            else:
                return JsonResponse({"error": "Failed to create tournament"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Get a tournament by name (GET)
def get_tournament(request, name):
    if request.method == 'GET':
        tournament = get_tournament_by_name(name)
        if tournament:
            response_data = {
                "name": tournament.name,
                "start_date": tournament.start_date,
                "end_date": tournament.end_date,
                "duration": tournament.duration
            }
            return JsonResponse(response_data, status=200)
        else:
            return JsonResponse({"error": "Tournament not found"}, status=404)

# Update a tournament (PUT)
def update_tournament_info(request, tournament_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            duration = data.get('duration')

            tournament = update_tournament(tournament_id, name=name, start_date=start_date, end_date=end_date, duration=duration)
            if tournament:
                return JsonResponse({"message": "Tournament updated successfully"}, status=200)
            else:
                return JsonResponse({"error": "Failed to update tournament"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Delete a tournament (DELETE)
def delete_tournament_info(request, tournament_id):
    if request.method == 'DELETE':
        if delete_tournament(tournament_id):
            return JsonResponse({"message": "Tournament deleted successfully"}, status=200)
        else:
            return JsonResponse({"error": "Tournament not found"}, status=404)


# ----- Statistic ----- #

# Create a statistic (POST)
def create_statistic(request)
  if request.method == 'POST'
    try:
      data = json.loads(request.body)
      name = data.get("name")
      wins = data.get("wins")
      losses = data.get("losses")
      playtime = data.get("playtime")
      user_id = data.get("user_id")

      stat = add_statistic(name=name, wins=wins, losses=losses, playtime=playtime, user_id=user_id)
      if stat:
        return JsonResponse({"message": "Statistic created succesfully"}, status=201)
      else:
        return JsonResponse({"error": "Failed to create statistic"}, status=400)
    except Exception as e:
      return JsonResponse({"error": str(e)}, status=500)

# Get statistic (GET)
def get_statistic(request, user_id)
  if request.method == 'GET'
    stat = get_stat_by_user_id(user_id)
    if stat:
      reponse_data {
        "name" = stat.name
        "wins" = stat.wins
        "losses" = stat.losses
        "playtime" = stat.playtime
        "user_id" = stat.user_id
      }
      return JsonResponse(response_data, 200)
    else:
      return JsonResponse({"error": "statictic not found"}, status=404)

def update_statistic_info(request, user_id)
  if request.method == 'PUT'
    try:
      data = json.loads(request.body)
      name = data.get('name')
      wins = data.get('wins')
      losses = data.get('losses')
      playtime = data.get('playtime')
      user_id = data.get('user_id')

      stat = update_statistic(user_id, name=name, wins=wins, losses=losses, playtime=playtime)
      if stat:
        return JsonResponse({"message": "Statistic updated"}, status=200)
      else
        return JsonResponse({"error": "Failed to update statistic"}, status=400)
    except Exception as e:
      return JsonResponse({"error": str(e)}, status=500)

def delete_statistic_info(request, user_id)
  if request.method == 'DELETE'
    if delete_statistic(user_id):
      return JsonResponse({"message": "Statistic deleted successfully"}, status=200)
    else:
      return JsonResponse({"error": "Statistic not found"}, status=404)

# ----- Match History ----- #

# Create a match history (POST)
def create_match_history(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user1_id = data.get('user1_id')
            user2_id = data.get('user2_id')
            match_date = data.get('match_date')
            duration = data.get('duration')
            winner_id = data.get('winner_id')  # Get the winner's ID

            match = add_match_history(user1_id=user1_id, user2_id=user2_id, match_date=match_date, duration=duration, winner_id=winner_id)
            if match:
                return JsonResponse({"message": "Match history created successfully", "match_id": match.id}, status=201)
            else:
                return JsonResponse({"error": "Failed to create match history"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Get match history (GET)
def get_match_history(request, match_id):
    if request.method == 'GET':
        match = get_match_history_by_id(match_id)
        if match:
            response_data = {
                "user1": match.user1.id,
                "user2": match.user2.id,
                "winner": match.winner.id if match.winner else None,
                "match_date": match.match_date,
                "duration": match.duration
            }
            return JsonResponse(response_data, status=200)
        else:
            return JsonResponse({"error": "Match history not found"}, status=404)

# Update match history (PUT)
def update_match_history_info(request, match_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user1_id = data.get('user1_id')
            user2_id = data.get('user2_id')
            match_date = data.get('match_date')
            duration = data.get('duration')
            winner_id = data.get('winner_id')  # Get the winner's ID

            match = update_match_history(match_id, user1_id=user1_id, user2_id=user2_id, match_date=match_date, duration=duration, winner_id=winner_id)
            if match:
                return JsonResponse({"message": "Match history updated successfully"}, status=200)
            else:
                return JsonResponse({"error": "Failed to update match history"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

# Delete match history (DELETE)
def delete_match_history_info(request, match_id):
    if request.method == 'DELETE':
        if delete_match_history(match_id):
            return JsonResponse({"message": "Match history deleted successfully"}, status=200)
        else:
            return JsonResponse({"error": "Match history not found"}, status=404)
