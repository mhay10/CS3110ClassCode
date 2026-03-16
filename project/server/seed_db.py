from datetime import datetime
import argparse
import hashlib
import json
import uuid
import os


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def generate_uuid() -> str:
    return str(uuid.uuid4())


def create_user(username: str, password: str, email: str = None) -> dict:
    return {
        "_id": generate_uuid(),
        "id": generate_uuid(),
        "username": username,
        "passwordHash": hash_password(password),
        "email": email,
        "tournaments": [],
    }


def create_tournament(name: str, owner_id: str) -> dict:
    return {
        "_id": generate_uuid(),
        "id": generate_uuid(),
        "name": name,
        "createdAt": datetime.now().isoformat(),
        "brackets": [],
        "ownerId": owner_id,
    }


def create_player(name: str, seed: int) -> dict:
    return {
        "id": generate_uuid(),
        "name": name,
        "seed": seed,
    }


def create_bracket(name: str, bracket_type: str, players: list = None) -> dict:
    if players is None:
        players = []
    return {
        "name": name,
        "type": bracket_type,
        "players": players,
        "matches": [],
    }


# Parse command-line arguments
parser = argparse.ArgumentParser(
    description="Seed the tournament database with initial data."
)
parser.add_argument(
    "--db",
    type=str,
    required=True,
    help="Path to the database file (default: project.db)",
)

args = parser.parse_args()
db_path: str = args.db

# Create users
users = [
    create_user("mhay", "12345678", "mhay@example.com"),
    create_user("user2", "12345678", "user2@example.com"),
    create_user("user3", "12345678", "user3@example.com"),
]

# Create tournaments (2 per user)
tournaments = []
for idx, user in enumerate(users):
    for i in range(2):
        tournament = create_tournament(f"Tournament {idx + 1}-{i + 1}", user["id"])

        # Add brackets with sample players
        for bracket_idx in range(2):
            # Create players for this bracket
            players = []
            num_players = 4
            for player_idx in range(num_players):
                player = create_player(
                    f"Player {bracket_idx + 1}-{player_idx + 1}", player_idx + 1
                )
                players.append(player)

            # Create bracket with players
            bracket_type = "singles" if bracket_idx == 0 else "doubles"
            bracket = create_bracket(
                f"Bracket {bracket_idx + 1} ({bracket_type})", bracket_type, players
            )
            tournament["brackets"].append(bracket)

        tournaments.append(tournament)

# Write to database file
# Clear existing file if it exists
if os.path.exists(db_path):
    os.remove(db_path)

with open(db_path, "w") as f:
    # Write all users
    for user in users:
        f.write(json.dumps(user) + "\n")

    # Write all tournaments
    for tournament in tournaments:
        f.write(json.dumps(tournament) + "\n")

# Print summary
print(f"Database seeded successfully!")
print(f"  File: {db_path}")
print(f"  Users created: {len(users)}")
for user in users:
    print(f"    - {user['username']}")
print(f"  Tournaments created: {len(tournaments)}")
for tournament in tournaments:
    print(f"    - {tournament['name']}")
