<?php
use PHPUnit\Framework\TestCase;

class BackendTest extends TestCase
{
    private $baseUrl = 'http://localhost:8000/';
    private static $testUsername;
    private static $testPassword = 'testpassword12';

    public static function setUpBeforeClass(): void
    {
        // Create a user for login testing
        self::$testUsername = 'testuser_' . rand(1000, 9999);

        $payload = json_encode([
            "username" => self::$testUsername,
            "password" => self::$testPassword,
            "confirm_password" => self::$testPassword
        ]);

        $opts = [
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json",
                'content' => $payload
            ]
        ];

        $context = stream_context_create($opts);
        file_get_contents('http://localhost:8000/register.php', false, $context);
    }

    public function testGet_UserList()
    {
        $response = file_get_contents($this->baseUrl . 'listings.php');
        $this->assertNotFalse($response);

        $data = json_decode($response, true);
        //print_r($response);
        $this->assertEquals('success', $data['status']);
    }

    public function testPost_CreateUser()
    {
        $url = $this->baseUrl . 'register.php';
        $username = 'testuser_' . rand(1000, 9999);

        $payload = json_encode([
            "username" => $username,
            "password" => "testpassword12",
            "confirm_password" => "testpassword12"
        ]);

        $opts = [
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json",
                'content' => $payload
            ]
        ];

        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        $data = json_decode($result, true);
        //print_r($result);

        $this->assertEquals('success', $data['status']);
    }

    public function testPost_LoginUser()
    {
        $url = $this->baseUrl . 'login.php';

        $payload = json_encode([
            "username" => self::$testUsername,
            "password" => self::$testPassword
        ]);

        $opts = [
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json",
                'content' => $payload
            ]
        ];

        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        //print_r($result);
        $data = json_decode($result, true);

        $this->assertEquals('success', $data['status']);
    }

    public function testPost_FailedLogin()
    {
        $url = $this->baseUrl . 'login.php';

        $payload = json_encode([
            "username" => "wronguser",
            "password" => "wrongpass"
        ]);

        $opts = [
            'http' => [
                'method'  => 'POST',
                'header'  => "Content-Type: application/json",
                'content' => $payload
            ]
        ];

        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        //print_r($result);

        $data = json_decode($result, true);

        $this->assertEquals('error', $data['status']);
    }
}
