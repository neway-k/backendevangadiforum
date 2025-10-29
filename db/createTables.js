const db = require("./dbConfig");

async function createTables() {
  try {
    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        userid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) UNIQUE,
        firstname VARCHAR(20) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      ) ENGINE=InnoDB;
    `);

    // Create questions table
    await db.execute(`
        CREATE TABLE IF NOT EXISTS questions (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          questionid INT NOT NULL AUTO_INCREMENT UNIQUE,
          userid INT NOT NULL,
          title VARCHAR(200) NOT NULL,
          description VARCHAR(200) NOT NULL,
          tag VARCHAR(255),
          FOREIGN KEY(userid) REFERENCES users(userid)
        ) ENGINE=InnoDB AUTO_INCREMENT=1;
      `);

    // Create answers table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS answers (
        answerid INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        userid INT NOT NULL,
        questionid INT NOT NULL,
        answer VARCHAR(200) NOT NULL,
        FOREIGN KEY(questionid) REFERENCES questions(questionid),
        FOREIGN KEY(userid) REFERENCES users(userid)
      ) ENGINE=InnoDB;
    `);

    console.log("Tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating tables:", err);
    process.exit(1);
  }
}

createTables();
