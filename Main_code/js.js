// The GitHub raw URL for the JSON file
const jsonUrl = "https://raw.githubusercontent.com/soniamoretti/Final-Spotify-Challenge/refs/heads/main/Resources/Spotify_songs.json";

// Load the Spotify JSON data using d3.json
d3.json(jsonUrl).then((songs) => {
    // Sort the songs alphabetically by track name
    songs.sort((a, b) => {
        const nameA = String(a.track_name || "");
        const nameB = String(b.track_name || "");
        return nameA.localeCompare(nameB);
    });

   // Populate the dropdown with track names and artist names, truncating long names
let dropdown = d3.select("#selDataset");
songs.forEach((song, index) => {
    // Create the display text: track name + artist name
    let trackWithArtist = `${song.track_name} by ${song["artist(s)_name"]}`;
    // Truncate if longer than 40 characters (adjust as needed)
    let truncatedTrack = trackWithArtist.length > 40 ? trackWithArtist.substring(0, 37) + '...' : trackWithArtist;
    // Append the truncated song name to the dropdown
    dropdown.append("option")
        .text(truncatedTrack)
        .property("value", index);
});


    // Build the initial radar chart with the first song
    let firstSong = songs[0];
    buildRadarChart(firstSong);

    // Update radar chart when a new song is selected
    dropdown.on("change", function () {
        let selectedIndex = dropdown.property("value");
        let selectedSong = songs[selectedIndex];
        buildRadarChart(selectedSong);
    });

    // Create the Wordcloud chart
    const wordcloudData = processWordcloudData(songs);
    Highcharts.chart('container-wc', {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            }
        },
        series: [{
            type: 'wordcloud',
            data: wordcloudData, // Artist names
            name: 'Occurrences'
        }],
        title: {
            text: 'Most popular artist in 2023',
            align: 'left'
        },
        subtitle: {
            text: 'Project 3',
            align: 'left'
        },
        tooltip: {
            headerFormat: '<span style="font-size: 16px"><b>{point.key}</b></span><br>'
        }
    });

    // Process the data for the bar chart
    const barChartData = processBarChartData(songs);

    // Build the bar chart
    buildBarChart(barChartData.categories, barChartData.streams, barChartData.artists);
});

// Function to process artist names for the Wordcloud
function processWordcloudData(songs) {
    const artists = songs.flatMap(song => song["artist(s)_name"].split(", "));

    // Count artist repetitions
    const data = artists.reduce((arr, artist) => {
        let obj = Highcharts.find(arr, obj => obj.name === artist);
        if (obj) {
            obj.weight += 1;
        } else {
            obj = { name: artist, weight: 1 };
            arr.push(obj);
        }
        return arr;
    }, []);

    // Filter out artists with less than 8 repetitions
    const filteredData = data.filter(artist => artist.weight > 8);

    return filteredData;
}

// Function to process the top 20 songs based on streams for the bar chart
function processBarChartData(songs) {
    // Sort the songs by streams in descending order and take the top 20
    const topSongs = songs.sort((a, b) => b.streams - a.streams).slice(0, 20);

    // Prepare data for the bar chart
    const categories = topSongs.map(song => song.track_name); // Song names
    const streams = topSongs.map(song => song.streams); // Stream counts
    const artists = topSongs.map(song => song["artist(s)_name"]); // Artist names

    return { categories, streams, artists };
}

// UPDATED FUNCTION: Create the bar chart with artist names in the tooltip and Spotify styling
function buildBarChart(categories, streams, artists) {
    Highcharts.chart('container-bar', {
        chart: {
            type: 'bar',
            backgroundColor: '#191414', // Spotify dark background
        },
        title: {
            text: 'Top 20 Songs by Streams',
            style: {
                color: '#FFFFFF', // White title text
                fontSize: '18px'
            }
        },
        xAxis: {
            categories: categories, 
            labels: {
                style: {
                    color: '#FFFFFF' // White x-axis labels
                }
            }
        },
        yAxis: {
            title: {
                text: 'Streams (Billions)',
                style: {
                    color: '#FFFFFF' // White y-axis title
                }
            },
            labels: {
                style: {
                    color: '#FFFFFF' // White y-axis labels
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            itemStyle: {
                color: '#FFFFFF' // White legend text
            },
            itemMarginTop: 10, // Adjust margin between legend items
            padding: 5, // Reduce padding
            symbolHeight: 10 // Reduce symbol height to minimize space
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#FFFFFF' // White data labels
                    }
                }
            }
        },
        series: [{
            name: 'Streams',
            data: streams, 
            color: '#1DB954' // Spotify green for the bars
        }],
        tooltip: {
            formatter: function () {
                const songIndex = this.point.index; // Get the index of the hovered point
                const songName = categories[songIndex]; // Get the song name
                const artistName = artists[songIndex]; // Get the artist name
                return `<b>${songName}</b><br>Artist: ${artistName}<br>Streams: ${this.y}`;
            },
            backgroundColor: '#FFFFFF', // White tooltip background
            borderColor: '#1DB954', // Spotify green border for tooltip
            style: {
                color: '#191414' // Dark text inside tooltip
            }
        },
        credits: {
            enabled: false
        }
    });
}

// Function to build the radar (spiderweb) chart
function buildRadarChart(song) {
    Highcharts.chart('container', {
        chart: {
            polar: true,
            type: 'area',
            backgroundColor: '#191414', // Spotify dark background
        },
        title: {
            text: `${song.track_name} by ${song["artist(s)_name"]}`,
            style: {
                color: '#FFFFFF' // White title text
            }
        },
        pane: {
            size: '80%',
            background: [{
                backgroundColor: '#191414', // Dark background for the pane
                borderWidth: 1,
                borderColor: '#1DB954' // Spotify green border
            }]
        },
        xAxis: {
            categories: ['Danceability', 'Valence', 'Energy', 'Acousticness', 'Instrumentalness', 'Liveness', 'Speechiness'],
            tickmarkPlacement: 'on',
            lineWidth: 0,
            labels: {
                style: {
                    color: '#FFFFFF' // White labels for better visibility
                }
            }
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            title: {
                style: {
                    color: '#FFFFFF' // White y-axis title
                }
            },
            labels: {
                style: {
                    color: '#FFFFFF' // White y-axis labels for better visibility
                }
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}%</b><br/>',
            style: {
                color: '#FFFFFF' // White tooltip text
            }
        },
        plotOptions: {
            series: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, 'rgba(29, 185, 84, 0.8)'], // Spotify green with some transparency
                        [1, 'rgba(29, 185, 84, 0.8)']  // Same green
                    ]
                },
                lineWidth: 2,
                marker: {
                    enabled: true,
                    radius: 2,
                    fillColor: '#1DB954', // Spotify green
                    lineWidth: 1,
                    lineColor: '#FFFFFF' // White border around the markers
                }
            }
        },
        series: [{
            name: song.track_name,
            data: [
                song["danceability_%"], 
                song["valence_%"], 
                song["energy_%"], 
                song["acousticness_%"], 
                song["instrumentalness_%"], 
                song["liveness_%"],
                song["speechiness_%"]
            ],
            pointPlacement: 'on',
            color: '#1DB954', // Line color
        }],
        legend: {
            itemStyle: {
                color: '#FFFFFF', // White legend text
            }
        }
    });
}
