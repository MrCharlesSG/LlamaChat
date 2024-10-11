-- Inserción de datos en la tabla users
INSERT INTO users (username, password) VALUES
('vic.mar@example.com', '$2a$12$h0HcS2QDb/7zPASbLa2GoOTSRP6CWK0oX7pCK.dPjkM6L5N4pNovi'),
('ger.pa@example.com', '$2a$12$h0HcS2QDb/7zPASbLa2GoOTSRP6CWK0oX7pCK.dPjkM6L5N4pNovi'),
('maria.lopez@example.com', '$2a$12$h0HcS2QDb/7zPASbLa2GoOTSRP6CWK0oX7pCK.dPjkM6L5N4pNovi'),
('carlos.gomez@example.com', '$2a$12$h0HcS2QDb/7zPASbLa2GoOTSRP6CWK0oX7pCK.dPjkM6L5N4pNovi');

-- Inserción de datos en la tabla userdetails
INSERT INTO userdetails (email, name) VALUES
('vic.mar@example.com', 'Vicente'),
('ger.pa@example.com', 'German'),
('maria.lopez@example.com', 'María'),
('carlos.gomez@example.com', 'Carlos');

-- Inserción de datos en la tabla chat
INSERT INTO chat (title, creation, user_email) VALUES
('Capitales', '2023-10-01', 'vic.mar@example.com'),
('Aburrimiento total', '2023-10-02', 'vic.mar@example.com'),
('Chistes', '2023-10-03', 'vic.mar@example.com'),
('Exchanges', '2023-10-09', 'vic.mar@example.com');

-- Inserción de mensajes en la tabla message
INSERT INTO message (prompt, response, chat_message) VALUES
('What is the capital of Spain?', 'The capital of Spain is Madrid. Would you like to know more about this city or its significance in Spain?', 1),
('And what about Germany?', 'The capital of Germany is Berlin. Just like the previous question, I can provide additional information about this city if you like. Do you want to know more about Berlin or its significance in Germany?', 1),
('And the Netherlands?', 'The capital of the Netherlands (also known as Holland) is Amsterdam. This city is famous for its unique architecture, canals, and vibrant cultural scene. If you like, I can provide more information about the history and importance of Amsterdam in the context of the Netherlands.', 1),
('Tell me something interesting.', 'The speed of light is 299,792,458 meters per second.', 2),
('What is a galaxy?', 'It is a system of stars, gas, and dust bound together by gravity.', 2),
('Tell me a joke.', 'Why don’t birds use Facebook? Because they already have Twitter.', 3);

