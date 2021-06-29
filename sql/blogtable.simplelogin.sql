CREATE TABLE `blog_post`(
    `blog_id` int(11) NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `createdBy` VARCHAR(255) NOT NULL,
    `createdAt` DATE NOT NULL,
    `likes` INT NOT NULL DEFAULT 0,
    `dislikes` INT NOT NULL DEFAULT 0,
    `comment_count` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (`blog_id`),
    UNIQUE KEY (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;