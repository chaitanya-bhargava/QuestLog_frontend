import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarDropdown from "@/components/ui/AvatarDropdown";

const ProfilePage = () => {
  //dummy
  const user = {
    name: "John Doe",
    username: "johndoe123",
    avatar: "https://github.com/shadcn.png", // Replace with actual avatar URL
  };

  //dummy
  const games = {
    played: [
      {
        id: 1,
        name: 'Grand Theft Auto V',
        image: 'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg',
        genre: 'Action-Adventure',
        releaseDate: '2013-09-17',
      },
    ],
    currentlyPlaying: [
      {
        id: 2,
        name: 'Red Dead Redemption 2',
        image: 'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg',
        genre: 'Action-Adventure',
        releaseDate: '2018-10-26',
      },
    ],
    wantToPlay: [
      {
        id: 3,
        name: 'Hollow Knight',
        image: 'https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg',
        genre: 'Metroidvania',
        releaseDate: '2017-02-24',
      },
    ],
  };

  return (
    <div className="p-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">@{user.username}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Games</h2>

        <AvatarDropdown
          title={`Played (${games.played.length})`}
          games={games.played}
        />

        <AvatarDropdown
          title={`Currently Playing (${games.currentlyPlaying.length})`}
          games={games.currentlyPlaying}
        />

        <AvatarDropdown
          title={`Want to Play (${games.wantToPlay.length})`}
          games={games.wantToPlay}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
