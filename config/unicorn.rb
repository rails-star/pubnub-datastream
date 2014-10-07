UNI_BASE_PATH = '/home/denisbasyuk/workshop/pubnub-demos'
working_directory "#{UNI_BASE_PATH}/current"
pid "#{UNI_BASE_PATH}/shared/pids/unicorn.pid"
stderr_path "#{UNI_BASE_PATH}/current/log/unicorn_err.log"
stdout_path "#{UNI_BASE_PATH}/current/log/unicorn_out.log"

listen "/home/denisbasyuk/workshop/pubnub-demos/shared/sockets/unicorn.sock"
worker_processes 2
timeout 300

preload_app true

before_exec do |server|
    ENV['BUNDLE_GEMFILE'] = "#{UNI_BASE_PATH}/current/Gemfile"
end

before_fork do |server, worker|
    # Disconnect since the database connection will not carry over
    if defined? ActiveRecord::Base
        ActiveRecord::Base.connection.disconnect!
    end

    # Quit the old unicorn process
    old_pid = "#{server.config[:pid]}.oldbin"
    if File.exists?(old_pid) && server.pid != old_pid
        begin
            Process.kill("QUIT", File.read(old_pid).to_i)
        rescue Errno::ENOENT, Errno::ESRCH
            # someone else did our job for us
        end
    end
end


