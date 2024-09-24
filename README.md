# Project-3-Top-Sporify-Songs

Instructions to load csv to mongoDB

	mongoimport --db Spotify --collection songs --type csv --headerline --file spotify-2023.csv

---

# Spotify Top Songs Visualization Project

This project visualizes the top-streamed songs on Spotify in 2023 using various charts and graphs. The dataset consists of information about tracks such as track name, artist(s), and stream counts.

## Features

- **Dropdown Selection**: Browse songs using a dropdown that displays both the track name and artist(s). Long track names are truncated to fit within the dropdown.
- **Radar Chart**: Visualizes key song attributes like *danceability*, *energy*, *valence*, and more. The radar chart updates when a song is selected from the dropdown.
- **Word Cloud**: Displays the most popular artists based on the number of occurrences in the top songs list.
- **Bar Chart**: Shows the top 20 songs ranked by stream counts with Spotify-themed styling.

## Technologies Used

- **D3.js**: Fetches and processes the dataset and manages dynamic elements like the dropdown menu.
- **Highcharts**: Used to build the radar chart, bar chart, and word cloud visualization with customized tooltips and colors.
- **JavaScript**: Core functionality to process and display the dataset.
- **HTML & CSS**: Manages the structure and styles of the page.

## Dataset

The dataset contains information about the top-streamed songs on Spotify in 2023 and is sourced from a GitHub-hosted JSON file:

```
https://raw.githubusercontent.com/soniamoretti/Final-Spotify-Challenge/refs/heads/main/Resources/Spotify_songs.json
```

### Fields in the Dataset

- `track_name`: Name of the song.
- `artist(s)_name`: Name of the artist(s).
- `streams`: The number of streams (in billions).
- `danceability_%`, `valence_%`, `energy_%`, etc.: Percentage attributes representing different song features.


## Code Breakdown

### 1. **Loading the Data**

The data is loaded from the GitHub raw URL using D3.js:

```javascript
d3.json(jsonUrl).then((songs) => {
  // Code to process and display songs
});
```

### 2. **Dropdown Menu**

The dropdown menu allows the user to select a song. The track name and artist are displayed, and longer names are truncated for readability:

```javascript
let dropdown = d3.select("#selDataset");
songs.forEach((song, index) => {
  let trackWithArtist = `${song.track_name} by ${song["artist(s)_name"]}`;
  let truncatedTrack = trackWithArtist.length > 40 ? trackWithArtist.substring(0, 37) + '...' : trackWithArtist;
  dropdown.append("option").text(truncatedTrack).property("value", index);
});
```

### 3. **Radar Chart**

A radar chart is used to display the selected song’s key attributes such as *danceability*, *energy*, etc.:

```javascript
function buildRadarChart(song) {
  Highcharts.chart('container', {
    chart: { polar: true, type: 'area' },
    // Chart configuration
  });
}
```

### 4. **Word Cloud**

The word cloud visualization shows the most popular artists based on the number of songs they have in the top list:

```javascript
function processWordcloudData(songs) {
  const artists = songs.flatMap(song => song["artist(s)_name"].split(", "));
  // Code to count occurrences and build word cloud
}
```

### 5. **Bar Chart**

The bar chart ranks the top 20 songs by stream counts. It uses Spotify's color scheme to enhance the visual appeal:

```javascript
function buildBarChart(categories, streams, artists) {
  Highcharts.chart('container-bar', {
    chart: { type: 'bar' },
    // Chart configuration
  });
}
```