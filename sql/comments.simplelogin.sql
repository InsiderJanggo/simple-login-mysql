CREATE TABLE `comments`(
    `comment_id` INT NOT NULL AUTO_INCREMENT,
    `blog_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `createdBy` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `likes` INT NOT NULL DEFAULT 0,
    `dislikes` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`comment_id`),
    UNIQUE KEY (`blog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;