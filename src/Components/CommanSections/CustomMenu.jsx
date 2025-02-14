import { Button, IconButton, MenuItem, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

const DomainMenu = ({ domainData, courses }) => {

  const [selectedDomain, setSelectedDomain] = useState(null);

  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
  };

  console.log('courses', courses);
  

  const getCoursesForDomain = (domainId) => {
    // Collect course titles for the main domain and its children
    const matchedCourses = courses.filter((course) =>
      course.domain.some((d) => d.id === domainId)
    );
    return matchedCourses.map((course) => course);
  };

  // const handleOpenCourse = (course) => {
  //   console.log('courses', course);
  // };

  const handleOpenCourse = (item) => {
    // navigate(`/courseDetails/${item?.id}`);
    // navigate(`https://course.classiolabs.com/course/${item?.id}`);
    const url = `https://course.classiolabs.com/course/${item?.id}`
    window.open(url, '_blank', 'noreferrer');
    // handleClose();
    // handleCloseOnlineCourse();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
      {/* Parent Domains */}
      <div>
        {/* <h3>Domains</h3> */}
        <ul style={{ listStyle: "none", padding: 0, display: 'flex', gap: 1 }}>
          {domainData?.map((domain) => (
            <Typography key={domain.id}
              sx={{
                px: 0.5,
                py: 0.1,
                textAlign: 'start'
              }}
            >
              <li
                key={domain.id}
                style={{
                  cursor: "pointer",
                  margin: "10px",
                  color: selectedDomain?.id === domain.id ? "blue" : "black",
                  ":hover": {
                    background: '#003085',
                    color: '#fff'
                  },
                  textAlign: 'start',
                  fontWeight: "700",
                  fontSize: '14px'
                }}
                onClick={() => handleDomainClick(domain)}
              >
                {domain.name}
              </li>
              <ul style={{ marginTop: '5px', padding: 0, listStyle: 'none', marginLeft: '5px' }}>
                {getCoursesForDomain(domain.id)?.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleOpenCourse(item)}
                    style={{ padding: '5px', cursor: 'pointer' }}
                  >
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#555',
                        "&:hover": {
                          color: 'blue',
                        },
                      }}
                    >
                      {item?.title}
                    </Typography>
                  </li>

                ))}
              </ul>
            </Typography>
          ))}
        </ul>
      </div>
      {selectedDomain && selectedDomain.child.length > 0 && (
        <div>
          {/* <h3>Subdomains</h3> */}
          {selectedDomain && selectedDomain.child.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {/* <span style={{ fontWeight: "500", fontSize: '14px', padding: '5px' }}>Sub Domains</span> */}
              {selectedDomain?.child.map((sub) => {
                // Find matching courses
                const matchedCourses = courses.filter((course) =>
                  course.domain.some((domainItem) => domainItem.id === sub.id)
                );
                return (
                  <li
                    key={sub.id}
                    style={{
                      cursor: "pointer",
                      margin: "10px",
                      fontSize: "12px",
                      padding: "2px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ fontWeight: "700", fontSize: '14px' }}>{sub.name}</span>
                      <span style={{ color: "gray" }}>{sub.child.length === 0 ? <>➤</> : <></>}</span>
                    </div>
                    {matchedCourses.length > 0 && (
                      <ul style={{ listStyle: "none", paddingLeft: "20px" }}>
                        {matchedCourses.map((course, index) => (
                          <li
                            key={index}
                            onClick={() => handleOpenCourse(course)}
                            style={{ padding: '5px', cursor: 'pointer' }}
                          >
                            <Typography
                              sx={{
                                fontSize: '12px',
                                color: '#555',
                                "&:hover": {
                                  color: 'blue',
                                },
                              }}
                            >
                              {course?.title}
                            </Typography>
                          </li>

                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : ("")}
        </div>
      )
      }
    </div>
  );
};

export default DomainMenu;
