import { useEffect, useState } from 'react';

function SearchSportsAPI() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(
          'https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=Arsenal'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch Arsenal data');
        }

        const data = await response.json();
        setTeam(data.teams?.[0] ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return <p>Loading Arsenal data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!team) {
    return <p>No team data found.</p>;
  }

  return (
    <section
      style={{
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '16px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2>{team.strTeam}</h2>
      <p>
        <strong>League:</strong> {team.strLeague}
      </p>
      <p>
        <strong>Stadium:</strong> {team.strStadium}
      </p>
      <p>
        <strong>Country:</strong> {team.strCountry}
      </p>
      {team.strWebsite && (
        <p>
          <a href={team.strWebsite} target="_blank" rel="noreferrer">
            Official Website
          </a>
        </p>
      )}
      {team.strTeamBadge && (
        <img
          src={team.strTeamBadge}
          alt={`${team.strTeam} badge`}
          style={{ width: '120px' }}
        />
      )}
      {team.strDescriptionEN && (
        <p>{team.strDescriptionEN}</p>
      )}
    </section>
  );
}

export default SearchSportsAPI;