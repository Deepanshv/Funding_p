import React, { useState, useEffect, useRef } from "react";

const Analytics = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [mapView, setMapView] = useState("satellite");
  const [filterCategory, setFilterCategory] = useState("all");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Load campaigns data
  const loadCampaigns = () => {
    const realCampaigns = JSON.parse(
      localStorage.getItem("campaigns") || "[]"
    ).map((campaign) => {
      // Use campaign location data or fallback to default coordinates
      const lat = campaign.location?.lat || 28.6139;
      const lng = campaign.location?.lng || 77.209;
      const city = campaign.location?.city || "Unknown";
      const address =
        campaign.address ||
        campaign.location?.fullAddress ||
        "Location not specified";

      return {
        id: campaign.id.toString(),
        title: campaign.title,
        target: campaign.target,
        amountCollected: campaign.amountCollected || "0",
        category: "General",
        lat: lat,
        lng: lng,
        city: city,
        address: address,
      };
    });

    console.log("Analytics campaigns loaded:", realCampaigns);
    setCampaigns(realCampaigns);
  };

  useEffect(() => {
    loadCampaigns();

    // Refresh data every 5 seconds to catch new campaigns
    const interval = setInterval(loadCampaigns, 5000);

    return () => clearInterval(interval);
  }, []);

  // Initialize professional map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const loadLeaflet = async () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!window.L || mapInstance.current) return;

      mapInstance.current = window.L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5, // Zoom level to show the whole country
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: true,
        keyboard: true,
        dragging: true,
        touchZoom: true,
      });

      // Add multiple tile layers
      const osmLayer = window.L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "",
          maxZoom: 19,
        }
      );

      const satelliteLayer = window.L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri",
          maxZoom: 19,
        }
      );

      const terrainLayer = window.L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenTopoMap contributors",
          maxZoom: 17,
        }
      );

      // Add default layer
      osmLayer.addTo(mapInstance.current);

      // Add scale control
      window.L.control.scale().addTo(mapInstance.current);

      addMarkers();
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const addMarkers = () => {
    if (!mapInstance.current || !window.L) {
      console.log("Map not ready yet");
      return;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        mapInstance.current.removeLayer(marker);
      } catch (e) {
        console.log("Error removing marker:", e);
      }
    });
    markersRef.current = [];

    const filteredCampaigns = campaigns.filter(
      (campaign) =>
        filterCategory === "all" || campaign.category === filterCategory
    );

    console.log("=== ADDING MARKERS ===");
    console.log("Total campaigns:", campaigns.length);
    console.log("Filtered campaigns:", filteredCampaigns.length);

    if (filteredCampaigns.length === 0) {
      console.log("No campaigns to show on map");
      return;
    }

    let markersCreated = 0;

    filteredCampaigns.forEach((campaign, index) => {
      try {
        // Get coordinates with fallbacks
        let lat = parseFloat(campaign.lat);
        let lng = parseFloat(campaign.lng);

        // LOGGING ADDED FOR DEBUGGING
        if (isNaN(lat) || isNaN(lng)) {
          console.log(
            `❌ Invalid coordinates for "${campaign.title}" (lat: ${campaign.lat}, lng: ${campaign.lng}). Using defaults.`
          );
          // Default to a location in India
          lat = 19.076;
          lng = 72.8777;
        } else {
          console.log(
            `✅ Valid coordinates for "${campaign.title}": [${lat}, ${lng}]`
          );
        }

        const categoryColors = {
          Technology: "#3b82f6",
          Environment: "#10b981",
          Healthcare: "#ef4444",
          Education: "#8b5cf6",
          General: "#6b7280",
        };

        const color = categoryColors[campaign.category] || "#6b7280";
        const fundingPercentage =
          Math.round(
            (parseInt(campaign.amountCollected) / parseInt(campaign.target)) *
              100
          ) || 0;

        // Professional modern pin marker
        const pinIcon = window.L.divIcon({
          className: "custom-pin-marker",
          html: `
          <div style="
            position: relative;
            width: 24px;
            height: 24px;
            cursor: pointer;
          ">
            <div style="
              width: 24px;
              height: 24px;
              background: ${color};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 0 4px rgba(${color
                .slice(1)
                .match(/.{2}/g)
                .map((hex) => parseInt(hex, 16))
                .join(",")}, 0.3), 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 10px;
              color: white;
              transition: all 0.3s ease;
            ">${index + 1}</div>
          </div>
        `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          popupAnchor: [0, -12],
        });

        const marker = window.L.marker([lat, lng], {
          icon: pinIcon,
          riseOnHover: true,
        });

        // Professional popup
        const popupContent = `
        <div style="
          min-width: 280px; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          padding: 0;
          margin: -12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        ">
          <div style="padding: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <div style="
                width: 8px; 
                height: 8px; 
                background: ${color}; 
                border-radius: 50%;
                box-shadow: 0 0 10px ${color};
              "></div>
              <h3 style="
                margin: 0; 
                font-size: 16px; 
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0,0,0,0.3);
              ">${campaign.title}</h3>
            </div>
            
            <div style="
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 12px;
              backdrop-filter: blur(10px);
            ">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <span style="font-size: 12px;">📍</span>
                <span style="font-size: 13px; font-weight: 500;">${
                  campaign.city
                }</span>
                <span style="font-size: 11px; opacity: 0.8;">• ${
                  campaign.category
                }</span>
              </div>
              <div style="font-size: 11px; opacity: 0.9;">${
                campaign.address
              }</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div style="text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #10b981;">
                  ₹${parseInt(campaign.amountCollected).toLocaleString()}
                </div>
                <div style="font-size: 11px; opacity: 0.8;">Raised</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 18px; font-weight: bold; color: #fbbf24;">
                  ₹${parseInt(campaign.target).toLocaleString()}
                </div>
                <div style="font-size: 11px; opacity: 0.8;">Target</div>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 12px; font-weight: 500;">Progress</span>
                <span style="font-size: 12px; font-weight: bold;">${fundingPercentage}%</span>
              </div>
              <div style="
                width: 100%; 
                height: 6px; 
                background: rgba(255,255,255,0.2); 
                border-radius: 3px; 
                overflow: hidden;
              ">
                <div style="
                  width: ${Math.min(fundingPercentage, 100)}%; 
                  height: 100%; 
                  background: linear-gradient(90deg, ${color}, #10b981);
                  border-radius: 3px;
                  transition: width 0.5s ease;
                "></div>
              </div>
            </div>

            <div style="
              display: flex; 
              justify-content: center; 
              padding-top: 8px;
              border-top: 1px solid rgba(255,255,255,0.2);
            ">
              <button style="
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                border-radius: 6px;
                padding: 6px 12px;
                color: white;
                font-size: 11px;
                cursor: pointer;
                backdrop-filter: blur(10px);
              ">View Details</button>
            </div>
          </div>
        </div>
      `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "custom-popup",
        });

        // Add marker to map
        marker.addTo(mapInstance.current);
        markersRef.current.push(marker);
        markersCreated++;

        // Add click event
        marker.on("click", () => {
          setSelectedPin(selectedPin === index ? null : index);
        });

        // Add hover effects
        marker.on("mouseover", function () {
          try {
            const element = this.getElement();
            if (element && element.querySelector("div")) {
              element.querySelector("div").style.transform = "scale(1.2)";
              element.style.zIndex = "1000";
            }
          } catch (e) {
            console.log("Hover error:", e);
          }
        });

        marker.on("mouseout", function () {
          try {
            const element = this.getElement();
            if (element && element.querySelector("div")) {
              element.querySelector("div").style.transform = "scale(1)";
              element.style.zIndex = "500";
            }
          } catch (e) {
            console.log("Hover error:", e);
          }
        });

        console.log(`✅ Marker ${index + 1} created successfully`);
      } catch (error) {
        console.error(`❌ Error creating marker for ${campaign.title}:`, error);
      }
    });

    console.log(`=== MARKERS SUMMARY ===`);
    console.log(`Total markers created: ${markersCreated}`);
    console.log(`Markers in array: ${markersRef.current.length}`);

    // REMOVED LOGIC: This code was zooming in on the markers, preventing a full view of India.
    // To show the entire country, we need to leave the map's initial zoom and center as-is.
    // if (markersCreated > 0) {
    //   try {
    //     const group = new window.L.featureGroup(markersRef.current);
    //     mapInstance.current.fitBounds(group.getBounds().pad(0.1));
    //     console.log('✅ Map bounds adjusted to show all markers');
    //   } catch (e) {
    //     console.log('Could not fit bounds:', e);
    //   }
    // }
  };

  useEffect(() => {
    if (mapInstance.current) {
      console.log("Refreshing map markers, campaigns count:", campaigns.length);
      addMarkers();
    }
  }, [campaigns, filterCategory]);

  // Force map refresh when campaigns change
  useEffect(() => {
    if (mapInstance.current && campaigns.length > 0) {
      console.log("Forcing map refresh for", campaigns.length, "campaigns");
      setTimeout(() => {
        addMarkers();
      }, 1000); // Delay to ensure map is ready
    }
  }, [campaigns]);

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      filterCategory === "all" || campaign.category === filterCategory
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Enhanced Header */}
      <div
        style={{
          marginBottom: "40px",
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          padding: "32px",
          borderRadius: "20px",
          border: "1px solid #475569",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-20%",
            width: "60%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(29,192,113,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #1dc071 0%, #10b981 100%)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow: "0 8px 16px rgba(29, 192, 113, 0.3)",
              }}
            >
              📊
            </div>
            <div>
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "900",
                  margin: "0",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.02em",
                }}
              >
                Analytics Dashboard
              </h1>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "16px",
                  margin: "0",
                  marginTop: "4px",
                }}
              >
                Live insights • Geographic distribution • Performance metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {[
          {
            label: "Total Campaigns",
            value: campaigns.length,
            color: "#3b82f6",
            icon: "🎯",
            trend: "+12%",
            subtitle: "Active projects",
          },
          {
            label: "Total Raised",
            value: `₹${campaigns
              .reduce((sum, c) => sum + parseInt(c.amountCollected), 0)
              .toLocaleString()}`,
            color: "#10b981",
            icon: "💰",
            trend: "+28%",
            subtitle: "Funding secured",
          },
          {
            label: "Avg. Funding",
            value: `₹${Math.round(
              campaigns.reduce(
                (sum, c) => sum + parseInt(c.amountCollected),
                0
              ) / campaigns.length
            ).toLocaleString()}`,
            color: "#f59e0b",
            icon: "📊",
            trend: "+15%",
            subtitle: "Per campaign",
          },
          {
            label: "Success Rate",
            value: `${Math.round(
              (campaigns.filter(
                (c) => parseInt(c.amountCollected) >= parseInt(c.target) * 0.8
              ).length /
                campaigns.length) *
                100
            )}%`,
            color: "#8b5cf6",
            icon: "📈",
            trend: "+5%",
            subtitle: "80%+ funded",
          },
          {
            label: "Top Category",
            value: campaigns.length > 0 ? "General" : "None",
            color: "#ef4444",
            icon: "🌱",
            trend: campaigns.length > 0 ? "100%" : "0%",
            subtitle: "Most popular",
          },
          {
            label: "Completion Rate",
            value: `${Math.round(
              (campaigns.reduce(
                (sum, c) =>
                  sum + parseInt(c.amountCollected) / parseInt(c.target),
                0
              ) /
                campaigns.length) *
                100
            )}%`,
            color: "#06b6d4",
            icon: "⚡",
            trend: "+18%",
            subtitle: "Average progress",
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
              padding: "28px",
              borderRadius: "20px",
              border: "1px solid #475569",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
          >
            {/* Background decoration */}
            <div
              style={{
                position: "absolute",
                top: "-50%",
                right: "-50%",
                width: "100%",
                height: "100%",
                background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
                pointerEvents: "none",
              }}
            ></div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    boxShadow: `0 4px 12px ${stat.color}40`,
                  }}
                >
                  {stat.icon}
                </div>

                <div
                  style={{
                    background: `${stat.color}20`,
                    color: stat.color,
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "700",
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  ↗ {stat.trend}
                </div>
              </div>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#ffffff",
                  marginBottom: "4px",
                  lineHeight: "1",
                }}
              >
                {stat.value}
              </div>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "2px",
                }}
              >
                {stat.label}
              </div>

              <div style={{ color: "#64748b", fontSize: "12px" }}>
                {stat.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Professional Enhanced Map */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          padding: "32px",
          borderRadius: "20px",
          marginBottom: "32px",
          border: "2px solid #475569",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Background Elements */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(29,192,113,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        ></div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div></div>

          <div style={{ display: "flex", gap: "12px" }}></div>
        </div>

        {/* Enhanced Map Container */}
        <div
          style={{
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
            border: "3px solid #475569",
          }}
        >
          <div
            ref={mapRef}
            style={{
              width: "100%",
              height: "650px",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
