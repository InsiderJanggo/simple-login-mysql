CREATE TABLE `blog_post`(
    `blog_id` TEXT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` TEXT NOT NULL,
    `createdBy` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `likes` INT NOT NULL DEFAULT 0,
    `dislikes` INT NOT NULL DEFAULT 0,
    `comment_count` INT NOT NULL DEFAULT 0,
    UNIQUE KEY (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;